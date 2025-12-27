package com.usosmatch.backend.model;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;


@Entity // informujemy że to tabela w bazie
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Baza sama nadaje numery
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String universityName;
    private String description;

    public User() {
    }

    public User(String firstName, String lastName, String email, String universityName, String description) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.universityName = universityName;
        this.description = description;
    }
    public Long getId(){
        return id;
    }
    public String getFirstName() {
        return firstName;
    }
    public String getLastName(){
        return lastName;
    }
    public String getEmail(){
        return email;
    }
    public String getUniversityName(){
        return universityName;
    }
    public String getDescription(){
        return description;
    }
    public void setId(Long id) {
        this.id=id;
    }
    public void setFirstName(String firstName){
        this.firstName=firstName;
    }
    public void setLastName(String lastName){
        this.lastName=lastName;
    }
    public void setEmail(String email){
        this.email=email;
    }
    public void setUniversityName(String universityName){
        this.universityName=universityName;
    }
    public void setDescription(String description){
        this.description=description;
    }
}


