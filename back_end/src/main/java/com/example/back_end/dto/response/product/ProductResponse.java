package com.example.back_end.dto.response.product;

import com.example.back_end.dto.BrandDto;
import com.example.back_end.dto.GenderDto;
import com.example.back_end.dto.response.category.CategorySummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal basePrice;
    private BrandDto brand;
    private GenderDto gender;
    private List<CategorySummary> categories = new ArrayList<>();
    private ProductImageSummary primaryImage;
    private boolean featured;
    private boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

