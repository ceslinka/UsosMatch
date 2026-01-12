package com.usosmatch.backend.repository;

import com.usosmatch.backend.model.Interest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InterestRepository extends JpaRepository<Interest,Long>{ //Korzystamy z interfacu poniewaz Spring sam utworzy nam klase
    Optional<Interest> findByName(String name);
}
