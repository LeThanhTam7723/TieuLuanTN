package com.example.back_end.dto.response.product;

import com.example.back_end.dto.ColorDto;
import com.example.back_end.dto.SizeDto;
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
public class ProductVariantResponse {
    private Long id;
    private ProductSummary product;
    private SizeDto size;
    private ColorDto color;
    private String sku;
    private BigDecimal price;
    private Integer stockQuantity;
    private BigDecimal weightInKg;
    private boolean active;
    private List<ProductImageSummary> images = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}