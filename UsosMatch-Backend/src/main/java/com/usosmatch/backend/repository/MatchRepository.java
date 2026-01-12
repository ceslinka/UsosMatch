package com.usosmatch.backend.repository;


import com.usosmatch.backend.model.Match;
import com.usosmatch.backend.model.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    //Skladnia wymagana przez JPQL
    @Query("SELECT match FROM Match match WHERE match.user1 = :user OR match.user2 = :user") //Znalezienie wszystkich matchy niezaleznie od pozycji na userze
    List<Match> findAllForUser(@Param("user") User user); //Zamiast samemu wymyślać zapytanie odwołuje sie do stworzonego przez nas wyzej
}
