package com.example.back_end.repository;

import com.example.back_end.entity.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Long> {
    List<ProductImage> findByProductId(Long productId);
    
    List<ProductImage> findByProductIdIn(List<Long> productIds);
    
    void deleteByProductId(Long productId);

    List<ProductImage> findByVariantId(Long variantId);

    Optional<ProductImage> findFirstByProduct_Id(Long productId);
}