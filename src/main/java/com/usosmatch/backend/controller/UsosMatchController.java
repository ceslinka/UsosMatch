package com.usosmatch.backend.controller;
import com.usosmatch.backend.model.User;
import com.usosmatch.backend.service.UserService;
import org.springframework.web.bind.annotation.*;
import java.util.List;
@RestController // Zwracamy JSON
@RequestMapping("/api")
public class UsosMatchController {
    private final UserService userService;
    public UsosMatchController(UserService userService) {
        this.userService = userService;
    }
    @PostMapping("/users")
    public User createUser(@RequestBody User user) { // RequestBody zmienia z JSON na obiekt JAVA
        return userService.registerUser(user);
    }
    @GetMapping("/users")
    public List<User> getUsers() {
        return userService.getAllUsers();
    }
}