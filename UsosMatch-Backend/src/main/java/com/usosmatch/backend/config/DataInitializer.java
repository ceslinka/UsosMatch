package com.usosmatch.backend.config;

import com.usosmatch.backend.model.Interest;
import com.usosmatch.backend.repository.InterestRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer {

    // CommandLineRunner to metoda, która odpala się tuż po starcie aplikacji
    @Bean
    public CommandLineRunner loadData(InterestRepository interestRepository) {
        return args -> {
            // Sprawdzamy, czy baza zainteresowań jest pusta
            if (interestRepository.count() == 0) {
                List<String> defaultInterests = Arrays.asList(
                        "Sport", "Muzyka", "Netflix", "Podróże",
                        "Programowanie", "Gry Wideo", "Gotowanie",
                        "Książki", "Siłownia", "Planszówki"
                );

                for (String name : defaultInterests) {
                    interestRepository.save(new Interest(name, "Kategoria ogólna"));
                }

            }
        };
    }
}