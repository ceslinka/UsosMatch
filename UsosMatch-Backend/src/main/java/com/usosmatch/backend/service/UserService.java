package com.usosmatch.backend.service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import com.usosmatch.backend.model.Interest;
import com.usosmatch.backend.model.Match;
import com.usosmatch.backend.model.User;
import com.usosmatch.backend.repository.InterestRepository;
import com.usosmatch.backend.repository.MatchRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.usosmatch.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MatchRepository matchRepository;
    // DODANO:
    private final InterestRepository interestRepository;
    private final PasswordEncoder passwordEncoder;

    // PAMIĘTAJ O ZAKTUALIZOWANIU KONSTRUKTORA!
    public UserService(UserRepository userRepository, MatchRepository matchRepository, InterestRepository interestRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.matchRepository = matchRepository;
        this.interestRepository = interestRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Taki email już istnieje");
        }

        String plainPassword = user.getPassword();
        String hashedPassword = passwordEncoder.encode(plainPassword); // Robimy "sałatkę"
        user.setPassword(hashedPassword);

        // Przy rejestracji też warto załadować pasje "porządnie", jeśli jakieś są
        return userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Użytkownik o takim ID nie istnieje"));
        List<Match> matches = matchRepository.findAllForUser(user);
        matchRepository.deleteAll(matches);
        userRepository.deleteById(userId);
    }

    // --- NAPRAWIONA METODA AKTUALIZACJI ---
    public User updateUser(Long userId, User updatedDetails) {
        return userRepository.findById(userId).map(existingUser -> {

            // 1. Aktualizacja prostych danych
            existingUser.setHeight(updatedDetails.getHeight());
            existingUser.setDateOfBirth(updatedDetails.getDateOfBirth());
            existingUser.setDescription(updatedDetails.getDescription());

            // 2. NAPRAWA ZAPISYWANIA PASJI
            // Frontend wysyła listę obiektów, gdzie jest tylko ID: [{id:1}, {id:5}]
            // Musimy pobrać z bazy PEŁNE obiekty Interest na podstawie tych ID.
            if (updatedDetails.getInterests() != null) {

                // Wyciągamy same numerki ID z tego co przyszło
                List<Long> interestIds = updatedDetails.getInterests().stream()
                        .map(Interest::getId)
                        .collect(Collectors.toList());

                // Pobieramy prawdziwe obiekty z bazy
                List<Interest> realInterestsList = interestRepository.findAllById(interestIds);

                // Zamieniamy na zbiór (Set) i przypisujemy użytkownikowi
                existingUser.setInterests(new HashSet<>(realInterestsList));
            }

            return userRepository.save(existingUser);
        }).orElseThrow(() -> new RuntimeException("Nie znaleziono usera"));
    }
    // -------------------------------------

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Nie znaleziono użytkownika: " + email));
    }




}