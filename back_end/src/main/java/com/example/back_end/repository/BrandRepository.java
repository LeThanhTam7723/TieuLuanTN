package com.example.back_end.repository;

import com.example.back_end.entity.Brand;
import com.example.back_end.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Long> {
    Optional<Brand> findByName(String name);
} 