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
        List<Match> matches = new ArrayList<>();
       for(User candidate : allUsers){
           if(candidate.getId().equals(currentUser.getId())){
               continue;
           }

           int score = calculateScore(currentUser, candidate);

           if(score >0){
               Match newMatch = new Match(currentUser,candidate,score, MatchStatus.PENDING); //Nadajemy jako oczekujacy aby uzytkownik mogl zdecydowac
               matchRepository.save(newMatch);
               matches.add(newMatch);
           }
       }
        matches.sort((m1, m2) -> Integer.compare(m2.getCompabilityScore(), m1.getCompabilityScore())); //Sortowanie według wyniku

        return matches;
    }

    private int calculateScore(User user1, User user2){
        int score = 0;
        Set<Interest> commonInterest =  new HashSet<>(user1.getInterests()); //Kopiujemy zainteresowania do zbioru aby nie zniekształcic bazy danych

        commonInterest.retainAll(user2.getInterests());
        score += commonInterest.size() * 10;

        for(TimeSlot slot1: user1.getSchedule()){
            for(TimeSlot slot2: user2.getSchedule()) {
                if(slot1.overlaps(slot2)){ //Uzywamy wczesniej stworzonej metody z TimeSlot
                    score += 25;
                }
            }
        }

        return score;
    }



}
