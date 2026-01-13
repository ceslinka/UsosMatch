package com.usosmatch.backend.controller;
import com.usosmatch.backend.model.Match;
import com.usosmatch.backend.model.User;
import com.usosmatch.backend.service.MatchingService;
import com.usosmatch.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController // Zwracamy JSON
@RequestMapping("/api")
public class UsosMatchController {
    private final UserService userService;
    private final MatchingService matchingService;

    public UsosMatchController(UserService userService, MatchingService matchingService) {
        this.userService = userService;
        this.matchingService = matchingService;
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

    @PostMapping("/matches/generate")
    public List<Match> generateUserMatches(@RequestParam Long userId) {
        return matchingService.generateMatches(userId);
    }

    @DeleteMapping("/users/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }

}