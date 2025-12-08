package com.usosmatch.backend.service;

import java.util.List;
import com.usosmatch.backend.model.User;
import org.springframework.stereotype.Service;
import com.usosmatch.backend.repository.UserRepository;

@Service // Uzywamy Springa, zamiast pisać "UserService service = new UserService(repo);'

public class UserService {
    private final UserRepository userRepository; // final oznacza że pole musi zostać wypelnione raz i nie moze się zmienic
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    } // wypelniamy userRepository w momencie tworzenia obiektu UserService
    public User registerUser(User user) {
        System.out.println("Rejestruję nowego użytkownika: " + user.getEmail());
        return userRepository.save(user); // to metoda która robi INSERT w bazie
    }
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
