package com.usosmatch.backend.service;

import java.util.List;

import com.usosmatch.backend.model.Match;
import com.usosmatch.backend.model.User;
import com.usosmatch.backend.repository.MatchRepository;
import org.springframework.stereotype.Service;
import com.usosmatch.backend.repository.UserRepository;

@Service // Uzywamy Springa, zamiast pisać "UserService service = new UserService(repo);'

public class UserService {

    private final UserRepository userRepository; // final oznacza że pole musi zostać wypelnione raz i nie moze się zmienic
    private final MatchRepository matchRepository;

    public UserService(UserRepository userRepository, MatchRepository matchRepository) {
        this.userRepository = userRepository; //Tworzymy zmienną tymczasową
        this.matchRepository = matchRepository;
    } // wypelniamy userRepository w momencie tworzenia obiektu UserService


    public User registerUser(User user) {
        if(userRepository.findByEmail(user.getEmail()).isPresent()){
            throw new RuntimeException("Taki email juz istnieje");
        }
        else {
            System.out.println("Rejestruję nowego użytkownika: " + user.getEmail());
            return userRepository.save(user); // to metoda która robi INSERT w bazie
        }
    }

    public void deleteUser(Long userId){
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Użytkownik o takim ID nie istnieje"));
        List<Match> matche = matchRepository.findAllForUser(userRepository.getReferenceById(userId));
        matchRepository.deleteAll(matche);
        userRepository.deleteById(userId);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika o emailu: " + email)); //Wyrzucenie błędu przy wyjątku
    }
}
