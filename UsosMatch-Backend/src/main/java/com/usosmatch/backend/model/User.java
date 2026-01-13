package com.usosmatch.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.time.LocalDate;


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
    private LocalDate dateOfBirth;
    private int height;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<TimeSlot> schedule = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER, cascade = CascadeType.ALL) //Pozwala aby user mial wiele zainteresowan i zainteresowanie mialo weiele userow
    //Fetch pozwala od razu pobrac wszystkie elementy bazy
    @JoinTable(
            name = "user_interests", //Tabela sluzaca do poleczenia uzytkownika z zainteresowaniami
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private Set<Interest> interests = new HashSet<>(); // Skorzystanie z zbioru dla zapewnienia unikalnosci elementow

    public User() {
    }

    public User(String firstName, String lastName, String email, String universityName, String description, Gender gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.universityName = universityName;
        this.description = description;
        this.gender = gender;
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
    public List<TimeSlot> getSchedule() {
        return schedule;
    }
    public void setSchedule(List<TimeSlot> schedule) {
        this.schedule = schedule;
    }
    public Gender getGender() {
        return gender;
    }
    public void setGender(Gender gender) {
        this.gender = gender;
    }
    public Set<Interest> getInterests() {
        return interests;
    }
    public void setInterests(Set<Interest> interests) {
        this.interests = interests;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public int getHeight() {
        return height;
    }

    public void setHeight(int height) {
        this.height = height;
    }
}


