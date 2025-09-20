package com.example.back_end.service.product;

import com.example.back_end.dto.request.product.ProductCreationRequest;
import com.example.back_end.dto.request.product.ProductUpdateRequest;
import com.example.back_end.dto.response.product.ProductDetailResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.entity.Product;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;

public interface IProductService {
    ProductResponse createProduct(ProductCreationRequest request);

    ProductResponse updateProduct(Long id, ProductUpdateRequest request);

    void deleteProduct(Long id);

    Product getProductById(Long id);

    ProductDetailResponse getProductDetailById(Long id);

    ProductDetailResponse getProductBySlug(String slug);

    boolean existsBySlug(String slug);

    PageResponse<ProductSummary> getAllProducts(Pageable pageable);

    PageResponse<ProductSummary> getFeaturedProducts(Pageable pageable);

    PageResponse<ProductSummary> searchProducts(String keyword, Pageable pageable);

    List<ProductSummary> getProductsByBrand(Long brandId);

    List<ProductSummary> getProductsByGender(String genderName);

    List<ProductSummary> getProductsByCategory(Long categoryId);

    void toggleProductStatus(Long id);

    void toggleFeaturedStatus(Long id);

    PageResponse<ProductSummary> getProductsByCategoryName(String categoryName, Pageable pageable);

    PageResponse<ProductSummary> getProductsByCategorySlug(String categorySlug, Pageable pageable);

    PageResponse<ProductSummary> getRelatedProducts(Long productId, Pageable pageable);

    PageResponse<ProductSummary> getFilteredProductsByCategorySlugWithFilter(
            String categorySlug,
            List<Long> colorIds,
            List<Long> sizeIds,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable);
} 