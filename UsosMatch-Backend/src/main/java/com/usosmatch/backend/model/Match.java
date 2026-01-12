package com.usosmatch.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)

    private long id;

    @ManyToOne // Pozwolonie uzyskanie wiecej niz jednego matcha
    @JoinColumn(name = "user1_id") //Dodanie nowej kolumny do tabeli matches
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private User user2;

    private int compabilityScore;

    private LocalDateTime matchDate;

    @Enumerated(EnumType.STRING)
    private MatchStatus status;

    public Match(){}

    public Match(User user1, User user2, int compabilityScore, MatchStatus status){
        this.user1 = user1;
        this.user2 = user2;
        this.compabilityScore = compabilityScore;
        this.status = status;
        this.matchDate = LocalDateTime.now(); // Ustawienie momentu zmaczowania
    }


    public long getId() {
        return id;
    }

    public void setId(long id) {
        id = id;
    }

    public User getUser1() {
        return user1;
    }

    public void setUser1(User user1) {
        this.user1 = user1;
    }

    public User getUser2() {
        return user2;
    }

    public void setUser2(User user2) {
        this.user2 = user2;
    }

    public int getCompabilityScore() {
        return compabilityScore;
    }

    public void setCompabilityScore(int compabilityScore) {
        this.compabilityScore = compabilityScore;
    }

    public LocalDateTime getMatchDate() {
        return matchDate;
    }

    public void setMatchDate(LocalDateTime matchDate) {
        this.matchDate = matchDate;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }
}
