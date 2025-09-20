package com.example.back_end.dto.response.product;

import com.example.back_end.dto.BrandDto;
import com.example.back_end.dto.GenderDto;
import com.example.back_end.dto.response.category.CategoryResponse;
import com.example.back_end.dto.response.category.CategorySummary;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductDetailResponse {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private BrandDto brand;
    private GenderDto gender;
    private BigDecimal basePrice;
    private List<CategoryResponse> categories = new ArrayList<>();
    private List<ProductImageResponse> images = new ArrayList<>();
    private List<ProductVariantResponse> variants = new ArrayList<>();
    private boolean featured;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}