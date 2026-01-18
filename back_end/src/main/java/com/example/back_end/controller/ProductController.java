package com.example.back_end.controller;

import com.example.back_end.dto.meilisearch.ProductSummaryForSearch;
import com.example.back_end.dto.request.product.ProductCreationRequest;
import com.example.back_end.dto.request.product.ProductUpdateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.dto.response.product.ProductCard;
import com.example.back_end.dto.response.product.ProductDetailResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.entity.Product;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.service.product.IProductService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.meilisearch.sdk.Client;
import com.meilisearch.sdk.Config;
import com.meilisearch.sdk.Index;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
public class ProductController {
    private final IProductService productService;
    private final Client client;
    @Autowired
    private ObjectMapper objectMapper;


    @DeleteMapping("/suggest")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public void deleteProduct(@RequestParam String id) {
        Index index = client.getIndex("products");
        index.deleteDocument(id);
    }
    @PostMapping("/addSuggest")
    public ApiResponse<List<ProductSummaryForSearch>> addProduct(Pageable pageable) throws JsonProcessingException {
        PageResponse<ProductSummary> products =  productService.getAllProducts(pageable);
        List<ProductSummaryForSearch> searchProducts = products.getContent().stream().map(p ->
                ProductSummaryForSearch.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .basePrice(p.getBasePrice())
                        .brandName(p.getBrandName())
                        .slug(p.getSlug())
                        .primaryImageUrl(p.getPrimaryImage() != null ? p.getPrimaryImage().getImageUrl() : null)
                        .genderName(p.getGenderName())
                        .featured(p.isFeatured())
                        .active(p.isActive())
                        .build()
        ).toList();

        Index index = client.getIndex("products");
        String json = objectMapper.writeValueAsString(searchProducts);
        index.addDocuments(json); // Bây giờ SDK sẽ serialize được

        return ApiResponse.<List<ProductSummaryForSearch>>builder()
                .code(1)
                .result(searchProducts)
                .message("Added successfully")
                .build();
    }


    /**
     * Method to create a new product
     *
     * @param request: Product creation request containing name, description, price, brand, etc.
     * @return JSON body contains created product information
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<ProductResponse> createProduct(@RequestBody ProductCreationRequest request) {
        return ResponseEntity.ok(productService.createProduct(request));
    }

    /**
     * Method to update an existing product
     *
     * @param id: Product's id
     * @param request: Product update request containing fields to update
     * @return JSON body contains updated product information
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<ProductResponse> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductUpdateRequest request) {
        return ResponseEntity.ok(productService.updateProduct(id, request));
    }

    /**
     * Method to get product details by ID
     *
     * @param id: Product's id
     * @return JSON body contains detailed product information including variants and images
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailResponse> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(productService.getProductDetailById(id));
    }

    /**
     * Method to get product details by slug
     *
     * @param slug: Product's slug
     * @return JSON body contains detailed product information including variants and images
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<ProductDetailResponse> getProductBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(productService.getProductBySlug(slug));
    }

    /**
     * Method to check if a product slug exists
     *
     * @param slug: Product's slug to check
     * @return JSON body contains boolean indicating if slug exists
     */
    @GetMapping("/check-slug")
    public ResponseEntity<Boolean> checkSlugExists(@RequestParam String slug) {
        return ResponseEntity.ok(productService.existsBySlug(slug));
    }

    /**
     * Method to get all products with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of product summaries
     */
    @GetMapping
    public ResponseEntity<PageResponse<ProductSummary>> getAllProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProducts(pageable));
    }

    @GetMapping("/productCard")
    public ResponseEntity<PageResponse<ProductCard>> getAllProductCards(Pageable pageable) {
        return ResponseEntity.ok(productService.getAllProductCards(pageable));
    }

    /**
     * Method to get featured products with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of featured product summaries
     */
    @GetMapping("/featured")
    public ResponseEntity<PageResponse<ProductCard>> getFeaturedProducts(Pageable pageable) {
        return ResponseEntity.ok(productService.getFeaturedProducts(pageable));
    }

    /**
     * Method to search products by keyword
     *
     * @param keyword: Search keyword to match against product name and description
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of matching product summaries
     */
    @GetMapping("/search")
    public ResponseEntity<PageResponse<ProductSummary>> searchProducts(
            @RequestParam String keyword,
            Pageable pageable) {
        return ResponseEntity.ok(productService.searchProducts(keyword, pageable));
    }

    /**
     * Method to get products by brand ID
     *
     * @param brandId: Brand's id
     * @return JSON body contains list of product summaries for the specified brand
     */
    @GetMapping("/brand/{brandId}")
    public ResponseEntity<List<ProductSummary>> getProductsByBrand(@PathVariable Long brandId) {
        return ResponseEntity.ok(productService.getProductsByBrand(brandId));
    }

    @GetMapping("/brand/slug/{slug}")
    public ResponseEntity<PageResponse<ProductCard>> getProductsByBrandSlug(@PathVariable String slug,Pageable pageable) {
        return ResponseEntity.ok(productService.getProductsByBrandSlug(slug,pageable));
    }

    /**
     * Method to get products by gender name
     *
     * @param genderName: Gender's name
     * @return JSON body contains list of product summaries for the specified gender
     */
    @GetMapping("/gender/{genderName}")
    public ResponseEntity<List<ProductSummary>> getProductsByGender(@PathVariable String genderName) {
        return ResponseEntity.ok(productService.getProductsByGender(genderName));
    }

    /**
     * Method to get products by category ID
     *
     * @param categoryId: Category's id
     * @return JSON body contains list of product summaries for the specified category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<List<ProductSummary>> getProductsByCategory(@PathVariable Long categoryId) {
        return ResponseEntity.ok(productService.getProductsByCategory(categoryId));
    }

    /**
     * Method to toggle product's active status
     *
     * @param id: Product's id
     * @return No content if status toggled successfully
     */
    @PatchMapping("/{id}/toggle-status")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> toggleProductStatus(@PathVariable Long id) {
        productService.toggleProductStatus(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to toggle product's featured status
     *
     * @param id: Product's id
     * @return No content if featured status toggled successfully
     */
    @PatchMapping("/{id}/toggle-featured")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> toggleFeaturedStatus(@PathVariable Long id) {
        productService.toggleFeaturedStatus(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get filtered products by category slug with additional filters
     *
     * @param categorySlug: Category's slug
     * @param colorIds: Optional list of color IDs to filter by
     * @param sizeIds: Optional list of size IDs to filter by
     * @param minPrice: Optional minimum price filter
     * @param maxPrice: Optional maximum price filter
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of filtered product summaries
     */
    @GetMapping("/category/slug/{categorySlug}")
    public ResponseEntity<PageResponse<ProductCard>> getProductsByCategorySlug(
            @PathVariable String categorySlug,
            @RequestParam(required = false) List<Long> colorIds,
            @RequestParam(required = false) List<Long> sizeIds,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            Pageable pageable) {

        PageResponse<ProductCard> response = productService.getFilteredProductsByCategorySlugWithFilter(
                categorySlug, colorIds, sizeIds, minPrice, maxPrice, pageable
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Method to get related products for a specific product
     *
     * @param id: Product's id to find related products for
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of related product summaries
     */
    @GetMapping("/{id}/related")
    public ResponseEntity<PageResponse<ProductCard>> getRelatedProducts(
            @PathVariable Long id,
            Pageable pageable) {
        return ResponseEntity.ok(productService.getRelatedProducts(id, pageable));
    }

    /**
     * Method to delete Product by ID
     *
     * @param id: Product's id
     * @return No content if deleted successfully
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')") // Tuỳ vào quyền
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }

} 