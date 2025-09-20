package com.example.back_end.repository;

import com.example.back_end.entity.Category;
import com.example.back_end.entity.Gender;
import com.example.back_end.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByActiveTrue(Pageable pageable);

    Page<Product> findByFeaturedTrueAndActiveTrue(Pageable pageable);

    @Query("SELECT p FROM Product p WHERE " +
            "LOWER(p.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(p.slug) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Product> searchProducts(String keyword, Pageable pageable);

    List<Product> findByBrandIdAndActiveTrue(Long brandId);

    List<Product> findByGenderIdAndActiveTrue(Long genderId);

    List<Product> findByGenderName(String genderName);

    List<Product> findByCategoriesIdAndActiveTrue(Long categoryId);

    boolean existsByNameAndBrandId(String name, Long brandId);

    @Query("SELECT p FROM Product p JOIN p.categories c WHERE c.name = :categoryName AND p.active = true")
    Page<Product> findByCategoriesNameAndActiveTrue(String categoryName, Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p " +
            "JOIN p.categories c " +
            "WHERE (c = :category OR c.parent = :category) " +
            "AND p.active = true")
    Page<Product> findByCategoryNameIncludingSubcategories(String categoryName, Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.variants v " +
            "WHERE p.id = :id")
    Optional<Product> findByIdWithDetails(Long id);

    @Query("SELECT p FROM Product p " +
            "LEFT JOIN FETCH p.variants v " +
            "WHERE p.slug = :slug AND p.active = true")
    Optional<Product> findBySlugWithDetails(String slug);

    boolean existsBySlug(String slug);

    @Query("SELECT DISTINCT p FROM Product p " +
            "JOIN p.categories c " +
            "WHERE (c = :category OR c.parent = :category) " +
            "AND p.gender = :gender " +
            "AND p.active = true")
    Page<Product> findByCategoriesAndGenderAndActiveTrue(Category category, Gender gender, Pageable pageable);

    @Query("SELECT p FROM Product p " +
            "JOIN p.categories c " +
            "WHERE c.slug = :categorySlug " +
            "AND p.active = true")
    Page<Product> findByCategorySlug(
            @Param("categorySlug") String categorySlug,
            Pageable pageable);

    @Query("SELECT DISTINCT p FROM Product p " +
            "LEFT JOIN p.categories c " +
            "WHERE p.id != :productId " +
            "AND p.active = true " +
            "AND (" +
            "   c.id IN :categoryIds " +
            "   OR p.brand.id = :brandId " +
            "   OR (:genderId IS NOT NULL AND p.gender.id = :genderId)" +
            ")")
    Page<Product> findRelatedProducts(
            @Param("productId") Long productId,
            @Param("categoryIds") List<Long> categoryIds,
            @Param("brandId") Long brandId,
            @Param("genderId") Long genderId,
            Pageable pageable);

    @Query("""
    SELECT DISTINCT p FROM Product p
    JOIN p.categories c
    LEFT JOIN p.variants v
    WHERE c.slug = :categorySlug
    AND (:colorIds IS NULL OR v.color.id IN :colorIds)
    AND (:sizeIds IS NULL OR v.size.id IN :sizeIds)
    AND (:minPrice IS NULL OR p.basePrice >= :minPrice)
    AND (:maxPrice IS NULL OR p.basePrice <= :maxPrice)
    AND p.active = true
""")
    Page<Product> findByCategorySlugWithFilters(
            @Param("categorySlug") String categorySlug,
            @Param("colorIds") List<Long> colorIds,
            @Param("sizeIds") List<Long> sizeIds,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            Pageable pageable
    );

}