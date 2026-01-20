package com.usosmatch.backend.controller;
import com.usosmatch.backend.model.Match;
import com.usosmatch.backend.model.User;
import com.usosmatch.backend.repository.InterestRepository;
import com.usosmatch.backend.service.MatchingService;
import com.usosmatch.backend.service.UserService;
import org.hibernate.Internal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController // Zwracamy JSON
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class UsosMatchController {
    private final UserService userService;
    private final MatchingService matchingService;
    private final InterestRepository interestRepository;
    private final PasswordEncoder passwordEncoder;

    public UsosMatchController(UserService userService, MatchingService matchingService, InterestRepository interestRepository, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.matchingService = matchingService;
        this.interestRepository = interestRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/users")
    public User createUser(@RequestBody User user) { // RequestBody zmienia z JSON na obiekt JAVA
        return userService.registerUser(user);
    }

    @GetMapping("/users/search")
    public User getUserByEmail(@RequestParam String email) {
        return userService.findByEmail(email);
    }

    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/matches/{userId}")
    public List<Match> getUserMatches(@PathVariable Long userId) { // ZMIANA: @PathVariable
        return matchingService.generateMatches(userId);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }

    @PostMapping("/matches/{matchId}/accept")
    public void acceptMatch(@PathVariable Long matchId, @RequestParam Long userId) {
        matchingService.acceptMatch(matchId, userId);
    }

    @PostMapping("/matches/{matchId}/reject")
    public void rejectMatch(@PathVariable Long matchId) {
        matchingService.rejectMatch(matchId);
    }

    @GetMapping("/interests")
    public List<com.usosmatch.backend.model.Interest> getAllInterests() {
        return interestRepository.findAll();
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Long id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }
    @PostMapping("/login")
    public User login(@RequestBody User loginData) {
        // 1. Szukamy użytkownika po emailu
        User user = userService.findByEmail(loginData.getEmail());

        // 2. Jeśli user istnieje I hasło się zgadza -> zwracamy usera
        if (user != null && passwordEncoder.matches(loginData.getPassword(), user.getPassword())) {
            return user;
        } else {
            // 3. Jeśli nie -> rzucamy błąd (Frontend to obsłuży)
            throw new RuntimeException("Błędny login lub hasło!");
        }
    }

    // Endpoint dla listy w "Dymku"
    @GetMapping("/matches/{userId}/list")
    public List<Match> getSuccessMatches(@PathVariable Long userId) {
        return matchingService.getSuccessMatches(userId);
    }
}
