package com.example.back_end.dto.request.product;

import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantUpdateRequest {
    private Long sizeId;

    private Long colorId;

    @Size(max = 50, message = "SKU cannot exceed 50 characters")
    private String sku;

    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private BigDecimal weightInKg;

    private Boolean active;
}