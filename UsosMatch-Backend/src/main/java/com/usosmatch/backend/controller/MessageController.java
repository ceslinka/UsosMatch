package com.usosmatch.backend.controller;

import com.usosmatch.backend.model.Message;
import com.usosmatch.backend.repository.MessageRepository;
import com.usosmatch.backend.service.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "http://localhost:5173") // kto może wejść


public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }
    @PostMapping
    public Message saveMessage(@RequestBody Message message){
        return messageService.saveMessage(message);
    }
    @GetMapping("/{user1}/{user2}")
    public List<Message> getConversation(@PathVariable Long user1, @PathVariable Long user2){
        return messageService.getConversation(user1, user2);
    }
}
