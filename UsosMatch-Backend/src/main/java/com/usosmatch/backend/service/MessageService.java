package com.usosmatch.backend.service;

import com.usosmatch.backend.model.Message;
import com.usosmatch.backend.repository.MessageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MessageService {
    private final MessageRepository messageRepository;

    public MessageService(MessageRepository messageRepository){
        this.messageRepository=messageRepository;
    }
    public Message saveMessage(Message message){
        return messageRepository.save(message);
    }
    public List<Message> getConversation(Long user1, Long user2){
        return messageRepository.findConversation(user1, user2);
    }


}
