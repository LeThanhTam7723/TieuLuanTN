package com.example.back_end.repository;

import com.example.back_end.entity.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {
    List<ProductVariant> findByProductIdAndActiveTrue(Long productId);
    
    Optional<ProductVariant> findByProductIdAndColorIdAndSizeIdAndActiveTrue(
        Long productId, Long colorId, Long sizeId);
    
    boolean existsByProductIdAndColorIdAndSizeId(Long productId, Long colorId, Long sizeId);
    
    List<ProductVariant> findByProductIdInAndActiveTrue(List<Long> productIds);

    Optional<ProductVariant> findBySkuAndActiveTrue(String sku);
} 