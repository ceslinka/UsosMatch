package com.usosmatch.backend.model;
import  jakarta.persistence.*; // Import bazy danych



@Entity //Odniesienie do naszej bazy danych
@Table(name = "interests") //Nadanie nazwy bazie
public class Interest {
    @Id //Primary key bazy
    @GeneratedValue(strategy = GenerationType.IDENTITY) //Automatyczne nadawanie numerów ID

    private long id;
    private String name;
    private String description;

    public Interest() {} //Wymóg bazy danych

    public Interest(String name, String description){
        this.name = name;
        this.description = description;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
