package com.usosmatch.backend.model;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity //Odnieisienie się do bazy danych
@Table(name = "matches") //Stworzenie tabeli
public class Match {
    @Id //Primary key bazy
    @GeneratedValue( strategy = GenerationType.IDENTITY) //Automatyczne nadawanie numerów ID

    private Long id;

    @ManyToOne // Pozwolonie uzyskanie wiecej niz jednego matcha
    @JoinColumn(name = "user1_id") //Dodanie nowej kolumny do tabeli matches
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private User user2; //korzystamy z całego obiektu user

    private int compabilityScore;

    private LocalDateTime matchDate; //Nowoczesny sposób trzymania daty w javie

    @Enumerated(EnumType.STRING) //Zapisujemy status jako napisy w bazie, dla czytelności
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
