package com.example.back_end.dto.request.product;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductUpdateRequest {
    @Size(min = 3, max = 100, message = "Product name must be between 3 and 100 characters")
    private String name;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    private BigDecimal basePrice;

    private Long brandId;

    private Long genderId;

    private List<Long> categoryIds;

    private Boolean featured;

    private Boolean active;

    private List<ProductVariantUpdateRequest> variants = new ArrayList<>();
}