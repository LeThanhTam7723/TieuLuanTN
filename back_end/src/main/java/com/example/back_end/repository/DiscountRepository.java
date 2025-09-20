package com.example.back_end.repository;

import com.example.back_end.entity.Discount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DiscountRepository extends JpaRepository<Discount,Long> {
    Discount findByCode(String code);
}
