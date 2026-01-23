package com.usosmatch.backend.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore; // <--- WAŻNE!
import jakarta.persistence.*;
import java.time.LocalTime;

@Entity
@Table(name = "time_slots")
public class TimeSlot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private DayOfWeek dayOfWeek;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime startTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm:ss")
    private LocalTime endTime;

    private boolean isFreeTime;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnore  // <--- BEZ TEGO ZROBI SIĘ PĘTLA I DANE ZNIKNĄ!
    private User user;

    public TimeSlot() {}

    public TimeSlot(DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime, boolean isFreeTime, User user) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isFreeTime = isFreeTime;
        this.user = user;
    }

    public boolean overlaps(TimeSlot other) {
        if (this.dayOfWeek != other.getDayOfWeek()) {
            return false;
        }
        return this.startTime.isBefore(other.getEndTime()) &&
                other.getStartTime().isBefore(this.endTime);
    }

    // Gettery i Settery
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public DayOfWeek getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(DayOfWeek dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public boolean isFreeTime() { return isFreeTime; }
    public void setFreeTime(boolean freeTime) { isFreeTime = freeTime; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
}