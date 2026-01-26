package com.usosmatch.backend.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstName;
    private String lastName;
    private String email;
    private String universityName;
    private String description;
    private LocalDate dateOfBirth;
    private int height;
    private String password;


    @Enumerated(EnumType.STRING)
    private Gender gender;

    // WAŻNE: FetchType.EAGER - ładuje grafik od razu!

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    //Pozwala aby wpisy w grafiku się nie powtarzały
    private List<TimeSlot> schedule = new ArrayList<>();

    @ManyToMany(fetch = FetchType.EAGER) //Pozwala na posiadanie wielu zainteresowan
    @JoinTable(
            name = "user_interests",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "interest_id")
    )
    private Set<Interest> interests = new HashSet<>(); //Niepowtarzający się zbiór

    public User() {}

    // Gettery i Settery
    public Long getId(){ return id; }
    public void setId(Long id) { this.id=id; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName){ this.firstName=firstName; }

    public String getLastName(){ return lastName; }
    public void setLastName(String lastName){ this.lastName=lastName; }

    public String getEmail(){ return email; }
    public void setEmail(String email){ this.email=email; }

    public String getUniversityName(){ return universityName; }
    public void setUniversityName(String universityName){ this.universityName=universityName; }

    public String getDescription(){ return description; }
    public void setDescription(String description){ this.description=description; }

    // --- KLUCZOWE GETTERY DO GRAFIKU ---
    public List<TimeSlot> getSchedule() { return schedule; }
    public void setSchedule(List<TimeSlot> schedule) { this.schedule = schedule; }
    // -----------------------------------

    public Gender getGender() { return gender; }
    public void setGender(Gender gender) { this.gender = gender; }

    public Set<Interest> getInterests() { return interests; }
    public void setInterests(Set<Interest> interests) { this.interests = interests; }

    public LocalDate getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(LocalDate dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public int getHeight() { return height; }
    public void setHeight(int height) { this.height = height; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

}