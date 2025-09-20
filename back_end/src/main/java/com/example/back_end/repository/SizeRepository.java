package com.example.back_end.repository;

import com.example.back_end.entity.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SizeRepository extends JpaRepository<Size, Long> {
    boolean existsByName(String name);
    Optional<Size> findByName(String name);
} 