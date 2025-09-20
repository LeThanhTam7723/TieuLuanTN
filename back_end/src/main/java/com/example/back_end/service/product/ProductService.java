package com.example.back_end.service.product;

import com.example.back_end.dto.request.product.ProductCreationRequest;
import com.example.back_end.dto.request.product.ProductUpdateRequest;
import com.example.back_end.dto.response.product.ProductDetailResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.entity.*;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ProductMapper;
import com.example.back_end.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import com.example.back_end.dto.response.PageResponse;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final GenderRepository genderRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreationRequest request) {
        if (productRepository.existsByNameAndBrandId(request.getName(), request.getBrandId())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTS);
        }

        String slug = generateSlug(request.getName());
        if (productRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.PRODUCT_SLUG_EXISTS);
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        Gender gender = request.getGenderId() != null ?
                genderRepository.findById(request.getGenderId())
                        .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND)) : null;

        List<Category> categories = categoryRepository.findByIdIn(request.getCategoryIds());

        Product product = Product.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .brand(brand)
                .gender(gender)
                .categories(categories)
                .active(request.isActive())
                .featured(request.isFeatured())
                .build();

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!product.getName().equals(request.getName()) &&
                productRepository.existsByNameAndBrandId(request.getName(), request.getBrandId())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTS);
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        Gender gender = request.getGenderId() != null ?
                genderRepository.findById(request.getGenderId())
                        .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND)) : null;

        List<Category> categories = categoryRepository.findByIdIn(request.getCategoryIds());

        productMapper.updateFromRequest(request, product);
        product.setBrand(brand);
        product.setGender(gender);
        product.setCategories(categories);

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
    }

    @Override
    public ProductDetailResponse getProductDetailById(Long id) {
        Product product = productRepository.findByIdWithDetails(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toDetailResponse(product);
    }

    @Override
    public ProductDetailResponse getProductBySlug(String slug) {
        Product product = productRepository.findBySlugWithDetails(slug)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toDetailResponse(product);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return productRepository.existsBySlug(slug);
    }

    private String generateSlug(String name) {
        // Convert to lowercase and replace spaces with hyphens
        String baseSlug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove special characters
                .replaceAll("\\s+", "-")         // Replace spaces with hyphens
                .replaceAll("-+", "-");          // Replace multiple hyphens with single hyphen

        String slug = baseSlug;
        int counter = 1;

        // Keep adding numbers until we find a unique slug
        while (productRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }

    @Override
        public PageResponse<ProductSummary> getAllProducts(Pageable pageable) {
            Page<Product> productPage = productRepository.findAll(pageable);
            return PageResponse.<ProductSummary>builder()
                .content(productPage.getContent().stream()
                        .map(productMapper::toSummary)
                        .toList())
                .pageNo(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Override
    public PageResponse<ProductSummary> getFeaturedProducts(Pageable pageable) {
        Page<Product> productPage = productRepository.findByFeaturedTrueAndActiveTrue(pageable);
        return PageResponse.<ProductSummary>builder()
                .content(productPage.getContent().stream()
                        .map(productMapper::toSummary)
                        .toList())
                .pageNo(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Override
    public PageResponse<ProductSummary> searchProducts(String keyword, Pageable pageable) {
        Page<Product> productPage = productRepository.searchProducts(keyword, pageable);
        return PageResponse.<ProductSummary>builder()
                .content(productPage.getContent().stream()
                        .map(productMapper::toSummary)
                        .toList())
                .pageNo(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Override
    public List<ProductSummary> getProductsByBrand(Long brandId) {
        return productRepository.findByBrandIdAndActiveTrue(brandId)
                .stream()
                .map(productMapper::toSummary)
                .toList();
    }

    @Override
    public List<ProductSummary> getProductsByGender(String genderName) {
        return productRepository.findByGenderName(genderName)
                .stream()
                .map(productMapper::toSummary)
                .toList();
    }

    @Override
    public List<ProductSummary> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoriesIdAndActiveTrue(categoryId)
                .stream()
                .map(productMapper::toSummary)
                .toList();
    }

    @Override
    @Transactional
    public void toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(!product.isActive());
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void toggleFeaturedStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setFeatured(!product.isFeatured());
        productRepository.save(product);
    }

    @Override
    public PageResponse<ProductSummary> getProductsByCategoryName(String categoryName, Pageable pageable) {
        Page<Product> productPage = productRepository.findByCategoryNameIncludingSubcategories(categoryName, pageable);
        return PageResponse.<ProductSummary>builder()
                .content(productPage.getContent().stream()
                        .map(productMapper::toSummary)
                        .toList())
                .pageNo(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Override
    public PageResponse<ProductSummary> getProductsByCategorySlug(String categorySlug, Pageable pageable) {
        Page<Product> productPage = productRepository.findByCategorySlug(categorySlug, pageable);
        return PageResponse.<ProductSummary>builder()
                .content(productPage.getContent().stream()
                        .map(productMapper::toSummary)
                        .toList())
                .pageNo(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

    @Override
    public PageResponse<ProductSummary> getRelatedProducts(Long productId, Pageable pageable) {
        Product product = productRepository.findByIdWithDetails(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Lấy danh sách category IDs của sản phẩm
        List<Long> categoryIds = product.getCategories().stream()
                .map(Category::getId)
                .toList();

        // Lấy danh sách sản phẩm liên quan dựa trên:
        // 1. Cùng category
        // 2. Cùng brand
        // 3. Cùng gender
        // 4. Không phải sản phẩm hiện tại
        // 5. Sản phẩm đang active
        Page<Product> relatedProducts = productRepository.findRelatedProducts(
                productId,
                categoryIds,
                product.getBrand().getId(),
                product.getGender() != null ? product.getGender().getId() : null,
                pageable
        );

        return PageResponse.<ProductSummary>builder()
                .content(relatedProducts.getContent().stream()
                        .map(productMapper::toSummary)
                        .toList())
                .pageNo(relatedProducts.getNumber())
                .pageSize(relatedProducts.getSize())
                .totalElements(relatedProducts.getTotalElements())
                .totalPages(relatedProducts.getTotalPages())
                .last(relatedProducts.isLast())
                .build();
    }

    public PageResponse<ProductSummary> getFilteredProductsByCategorySlugWithFilter(
            String categorySlug,
            List<Long> colorIds,
            List<Long> sizeIds,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Pageable pageable) {

        boolean categoryExists = categoryRepository.existsBySlug(categorySlug);
        if (!categoryExists) {
            throw new AppException(ErrorCode.CATEGORY_NOT_FOUND);
        }

        Page<Product> productPage = productRepository.findByCategorySlugWithFilters(
                categorySlug, colorIds, sizeIds, minPrice, maxPrice, pageable
        );

        List<ProductSummary> summaries = productMapper.toSummaryList(productPage.getContent());

        return PageResponse.<ProductSummary>builder()
                .content(summaries)
                .pageNo(productPage.getNumber())
                .pageSize(productPage.getSize())
                .totalElements(productPage.getTotalElements())
                .totalPages(productPage.getTotalPages())
                .last(productPage.isLast())
                .build();
    }

}