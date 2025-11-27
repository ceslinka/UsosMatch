package com.usosmatch.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private String description;
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    private List<TimeSlot> schedule;

}
