package com.example.back_end.repository;

import com.example.back_end.entity.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ColorRepository extends JpaRepository<Color, Long> {
    boolean existsByName(String name);
    Optional<Color> findByName(String name);
} 