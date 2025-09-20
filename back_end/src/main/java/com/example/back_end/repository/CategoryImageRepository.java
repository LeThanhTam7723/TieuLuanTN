package com.example.back_end.repository;

import com.example.back_end.entity.CategoryImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CategoryImageRepository extends JpaRepository<CategoryImage, Long> {
    Optional<CategoryImage> findByCategoryId(Long categoryId);
    void deleteByCategoryId(Long categoryId);
} 