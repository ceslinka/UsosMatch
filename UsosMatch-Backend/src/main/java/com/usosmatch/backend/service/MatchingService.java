package com.usosmatch.backend.service;


import com.usosmatch.backend.model.*;
import com.usosmatch.backend.repository.MatchRepository;
import com.usosmatch.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class MatchingService {
    private final UserRepository userRepository;
    private final MatchRepository matchRepository;

    public MatchingService(UserRepository userRepository, MatchRepository matchRepository){
        this.userRepository = userRepository;
        this.matchRepository = matchRepository; //Pobranie potrzebnych repo
    }

    public List<Match> generateMatches(Long userId){
       User currentUser = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o takim ID: " + userId)); //Znalezienie uzytkownika
       List<User> allUsers = userRepository.findAll(); //Pobranie wszytskich uzytkownikow
        List<Match> exisitingMatches = matchRepository.findAllForUser(currentUser); // Naprawienie bledu odswiezania
        List<Match> matches = new ArrayList<>();
       for(User candidate : allUsers){
           if(candidate.getId().equals(currentUser.getId())){
               continue;
           }

           int score = calculateScore(currentUser, candidate);

           if(score >0){
               Match matchToSave = findExistingMatch(exisitingMatches, candidate);
               if(matchToSave != null) {
                   matchToSave.setCompabilityScore(score);
               }else {
                   matchToSave = new Match(currentUser, candidate, score, MatchStatus.PENDING); //Nadajemy jako oczekujacy aby uzytkownik mogl zdecydowac
               }
               matchRepository.save(matchToSave);
               matches.add(matchToSave);
           }


       }
        matches.sort((m1, m2) -> Integer.compare(m2.getCompabilityScore(), m1.getCompabilityScore())); //Sortowanie według wyniku

        return matches;
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

    private int calculateScore(User user1, User user2){
        int score = 0;

        Set<String> set1 = new HashSet<>();

        Set<String> set2 = new HashSet<>();

        for(Interest inte: user1.getInterests()){
            set1.add(inte.getName().toLowerCase());
        }

        for(Interest inte: user2.getInterests()){
            set2.add(inte.getName().toLowerCase());
        }

        set1.retainAll(set2); //Pokrycie się elementów zainteresowania
        score += set1.size() * 10;

        for(TimeSlot slot1: user1.getSchedule()){
            for(TimeSlot slot2: user2.getSchedule()) {
                if(slot1.overlaps(slot2)){ //Uzywamy wczesniej stworzonej metody z TimeSlot
                    score += 25;
                }
            }
        }

        return score;
    }

    public void acceptMatch(Long matchId){
        // 1. Znajdź mecz lub wyrzuć błąd (tak jak przy Userze)
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono takiego matcha!"));

        // 2. Użyj settera, żeby zmienić status
        match.setStatus(MatchStatus.MATCHED);

        // 3. Zapisz ZMIENIONY obiekt (wstaw go do nawiasu)
        matchRepository.save(match);
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

}
