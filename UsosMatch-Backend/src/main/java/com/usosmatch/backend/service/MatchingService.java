package com.usosmatch.backend.service;


import com.usosmatch.backend.model.*;
import com.usosmatch.backend.repository.MatchRepository;
import com.usosmatch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import com.usosmatch.backend.model.MatchStatus;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class MatchingService {
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    public MatchingService(UserRepository userRepository, MatchRepository matchRepository) {
        this.userRepository = userRepository;
        this.matchRepository = matchRepository; //Pobranie potrzebnych repo
    }

    public List<Match> generateMatches(Long userId) {
        User currentUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o takim ID: " + userId)); //Znalezienie uzytkownika
        List<User> allUsers = userRepository.findAll(); //Pobranie wszytskich uzytkownikow
        List<Match> exisitingMatches = matchRepository.findAllForUser(currentUser); // Naprawienie bledu odswiezania
        List<Match> matches = new ArrayList<>();
        for (User candidate : allUsers) {
            if (candidate.getId().equals(currentUser.getId())) {
                continue;
            }

            int score = calculateScore(currentUser, candidate);

            if (score > 0) {
                Match matchToSave = findExistingMatch(exisitingMatches, candidate);
                if (matchToSave != null) {
                    matchToSave.setCompabilityScore(score);
                } else {
                    matchToSave = new Match(currentUser, candidate, score, MatchStatus.PENDING); //Nadajemy jako oczekujacy aby uzytkownik mogl zdecydowac
                }
                matchRepository.save(matchToSave);
                matches.add(matchToSave);
            }


        }
        matches.sort((m1, m2) -> Integer.compare(m2.getCompabilityScore(), m1.getCompabilityScore())); //Sortowanie według wyniku

        return matches.stream()
                .filter(match -> shouldDisplayMatch(match, userId))
                .sorted((m1, m2) -> Integer.compare(m2.getCompabilityScore(), m1.getCompabilityScore()))
                .collect(Collectors.toList());
    }



    // Metoda specjalnie dla zakładki "Dymek/Czat"
    // Zwraca TYLKO te, które są już parami (MATCHED)
    public List<Match> getSuccessMatches(Long userId) {
        User currentUser = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono usera"));

        List<Match> all = matchRepository.findAllForUser(currentUser);

        // Filtrujemy: Bierzemy tylko te z sukcesem
        return all.stream()
                .filter(m -> m.getStatus() == MatchStatus.MATCHED)
                .collect(Collectors.toList());
    }


    private Match findExistingMatch(List<Match> existingMatches, User candidate) {
        for (Match m : existingMatches) {
            // Sprawdzamy: Czy w tym matchu "tą drugą osobą" jest nasz kandydat?
            // Musimy sprawdzić obie strony (user1 i user2), bo nie wiemy gdzie zapisała nas baza
            if (m.getUser1().getId().equals(candidate.getId()) ||
                    m.getUser2().getId().equals(candidate.getId())) {
                return m;
            }
        }
        return null; // Nie znaleziono - to będzie nowa para
    }

    private int calculateScore(User user1, User user2) {
        int score = 0;

        Set<String> set1 = new HashSet<>();

        Set<String> set2 = new HashSet<>();

        for (Interest inte : user1.getInterests()) {
            set1.add(inte.getName().toLowerCase());
        }

        for (Interest inte : user2.getInterests()) {
            set2.add(inte.getName().toLowerCase());
        }

        set1.retainAll(set2); //Pokrycie się elementów zainteresowania
        int commonInterestCount = set1.size();
        int interestScore = Math.min(commonInterestCount * 10, 20);

        int timeOverlapsCount = 0;

        for (TimeSlot slot1 : user1.getSchedule()) {
            for (TimeSlot slot2 : user2.getSchedule()) {
                if (slot1.overlaps(slot2)) { //Uzywamy wczesniej stworzonej metody z TimeSlot
                    timeOverlapsCount++;
                }
            }
        }
        int timeScore = Math.min(timeOverlapsCount*20,80);

        return interestScore + timeScore;
    }

    public void acceptMatch(Long matchId, Long activeUserId) {
        // 1. Pobieramy mecz
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono matcha!"));

        // Sprawdzenie tożsamości
        Long user1Id = match.getUser1().getId();
        boolean isUser1 = user1Id.equals(activeUserId);

        System.out.println("--- ACCEPT MATCH DEBUG ---");
        System.out.println("Mecz ID: " + matchId);
        System.out.println("Obecny status: " + match.getStatus());
        System.out.println("Kto klika? UserID=" + activeUserId + " (Czy to user1? " + isUser1 + ")");

        // LOGIKA ZMIANY STATUSÓW (Uproszczona)
        MatchStatus currentStatus = match.getStatus();

        if (currentStatus == MatchStatus.PENDING) {
            // Pierwszy ruch
            if (isUser1) {
                match.setStatus(MatchStatus.LIKED_BY_USER_1);
                System.out.println("-> Zmieniono na: LIKED_BY_USER_1");
            } else {
                match.setStatus(MatchStatus.LIKED_BY_USER_2);
                System.out.println("-> Zmieniono na: LIKED_BY_USER_2");
            }
        }
        else if (currentStatus == MatchStatus.LIKED_BY_USER_1) {
            // Sytuacja: User 1 już dał Like
            if (!isUser1) {
                // Klika User 2 (to ten, co jeszcze nie klikał) -> MATCH!
                match.setStatus(MatchStatus.MATCHED);
                System.out.println("-> MAMY PARĘ! Status: MATCHED");
            } else {
                System.out.println("-> User 1 klika drugi raz. Bez zmian.");
            }
        }
        else if (currentStatus == MatchStatus.LIKED_BY_USER_2) {
            // Sytuacja: User 2 już dał Like
            if (isUser1) {
                // Klika User 1 (to ten, co jeszcze nie klikał) -> MATCH!
                match.setStatus(MatchStatus.MATCHED);
                System.out.println("-> MAMY PARĘ! Status: MATCHED");
            } else {
                System.out.println("-> User 2 klika drugi raz. Bez zmian.");
            }
        }

        matchRepository.save(match);
        System.out.println("--------------------------");
    }


    public void rejectMatch(Long matchId){
        // 1. Znajdź mecz lub wyrzuć błąd (tak jak przy Userze)
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono takiego matcha!"));

        // 2. Użyj settera, żeby zmienić status
        match.setStatus(MatchStatus.REJECTED);

        // 3. Zapisz ZMIENIONY obiekt (wstaw go do nawiasu)
        matchRepository.save(match);
    }


    // Metoda pomocnicza: Czy pokazać tę kartę temu użytkownikowi?
    private boolean shouldDisplayMatch(Match match, Long myUserId) {
        // 1. Sprawdzamy: Czy "JA" (myUserId) jestem Userem nr 1 w tej parze?
        boolean amIUser1 = match.getUser1().getId().equals(myUserId);

        switch (match.getStatus()) {
            case MATCHED:
                return false; // Już sparowani -> nie pokazuj w ogniu
            case REJECTED:
                return false; // Odrzuceni -> nie pokazuj
            case PENDING:
                return true;  // Nowa para -> pokaż

            case LIKED_BY_USER_1:
                // Status: "Polubione przez Usera 1"
                if (amIUser1) {
                    return false; // Ja jestem User 1 -> Ja już głosowałem -> Ukryj
                } else {
                    return true;  // Ja jestem User 2 -> User 1 mnie polubił -> Pokaż!
                }

            case LIKED_BY_USER_2:
                // Status: "Polubione przez Usera 2"
                if (amIUser1) {
                    return true;  // Ja jestem User 1 -> User 2 mnie polubił -> Pokaż!
                } else {
                    return false; // Ja jestem User 2 -> Ja już głosowałem -> Ukryj
                }

            default:
                return false;
        }
    }
}
