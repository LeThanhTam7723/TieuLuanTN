package com.example.back_end.repository;

import com.example.back_end.entity.Gender;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GenderRepository extends JpaRepository<Gender, Long> {
    Optional<Gender> findBySlug(String slug);
} 