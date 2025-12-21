package com.example.back_end.repository;

import com.example.back_end.entity.Product;
import com.example.back_end.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;

public interface ReviewRepository extends JpaRepository<Review,Long>, JpaSpecificationExecutor<Review> {
    List<Review> findByIdProduct_Product(Product productId);
}
