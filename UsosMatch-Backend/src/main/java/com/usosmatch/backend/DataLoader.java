package com.usosmatch.backend.config; // lub inny, w zależności gdzie go utworzysz

import com.usosmatch.backend.model.Message;
import com.usosmatch.backend.repository.MessageRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final MessageRepository messageRepository;

    public DataLoader(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Sprawdź, czy baza jest pusta, żeby nie dublować danych przy każdym restarcie
        if (messageRepository.count() == 0) {

            // Scenariusz: Ty (ID 1) gadasz z Partnerem (ID 2)

            // 1. Ty piszesz do niego
            messageRepository.save(new Message(1L, 2L, "Cześć! Jesteś tam?"));

            // 2. On odpisuje Tobie (zwróć uwagę na zamianę ID miejscami!)
            messageRepository.save(new Message(2L, 1L, "No hej! Tak, jestem."));

            // 3. Ty odpisujesz
            messageRepository.save(new Message(1L, 2L, "Super, działa!"));

            // Scenariusz: Ty (ID 1) piszesz do kogoś innego (ID 99)
            messageRepository.save(new Message(1L, 99L, "To jest inna rozmowa."));

            System.out.println("✅ ZAŁADOWANO PRZYKŁADOWE WIADOMOŚCI DO BAZY!");
        }
    }
}