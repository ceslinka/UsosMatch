package com.usosmatch.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import java.time.LocalDateTime;

@Entity
public class Message {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long senderId; // używamy zamiast całego obiektu
    private Long receiverId;
    private String content;
    private LocalDateTime timestamp;

    public Message() {
    }
    public Message(Long senderId, Long receiverId, String content, LocalDateTime timestamp) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
    }
    public Message(Long senderId, Long receiverId, String content) {
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = LocalDateTime.now(); // ustawiamy czas wysłania na czas w którym tworzymy obiekt
    }
    public Long getId(){
        return id;
    }
    public Long getSenderId(){
        return senderId;
    }
    public Long getReceiverId(){
        return receiverId;
    }
    public String getContent(){
        return content;
    }
    public LocalDateTime getTimestamp(){
        return timestamp;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setSenderId(Long senderId) {
        this.senderId=senderId;
    }
    public void setReceiverId(Long receiverId){
        this.receiverId=receiverId;
    }
    public void setContent(String content){
        this.content=content;
    }
    public void setTimestamp(LocalDateTime timestamp){
        this.timestamp=timestamp;
    }


}

