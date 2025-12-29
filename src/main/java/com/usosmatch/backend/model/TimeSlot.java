package com.usosmatch.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity //Mówimy że to encja(tabela)
@Table(name = "time_slots")
public class TimeSlot {
    @Id // traktujemy jako klucz główny
    @GeneratedValue(strategy = GenerationType.IDENTITY) // automatyczne generowanie wartości
    private Long id;


    @Enumerated(EnumType.STRING) // Żeby nie miec cyfr (0,1...)
    private DayOfWeek dayOfWeek;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime endTime;

    private boolean isFreeTime;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore
    private User user;

    public TimeSlot() {
    }

    public TimeSlot(DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, User user) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.user = user;
    }

    public boolean overlaps(TimeSlot other){
        if (this.dayOfWeek != other.dayOfWeek){ // Od razu odrzucamy jesli dni sie nie pokrywaja
            return false;
        }
        else{
            return this.startTime.isBefore(other.getEndTime()) && other.getStartTime().isBefore(this.endTime);
            // Sprawdzenie pokrycia czasowego za pomoca isBefore czyli <
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public boolean isFreeTime() {
        return isFreeTime;
    }

    public void setFreeTime(boolean freeTime) {
        isFreeTime = freeTime;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(DayOfWeek dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
    public User getUser() {
        return user;
    }
    public void setUser(User user) {
        this.user=user;
    }

}