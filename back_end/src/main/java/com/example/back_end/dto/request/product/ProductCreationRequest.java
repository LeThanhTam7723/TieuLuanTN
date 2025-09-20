package com.example.back_end.dto.request.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCreationRequest {
    @NotBlank(message = "Product name is required")
    @Size(min = 3, max = 100, message = "Product name must be between 3 and 100 characters")
    private String name;

    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;

    @NotNull(message = "Base price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Base price must be greater than 0")
    private BigDecimal basePrice;

    @NotNull(message = "Slug is required")
    private String slug;

    @NotNull(message = "Brand ID is required")
    private Long brandId;

    @NotNull(message = "Gender ID is required")
    private Long genderId;

    @NotNull(message = "Category IDs are required")
    private List<Long> categoryIds = new ArrayList<>();

    private boolean featured;

    private boolean active = true;
}
