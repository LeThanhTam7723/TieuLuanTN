package com.example.back_end.dto.response.product;

import com.example.back_end.dto.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductVariantSummary {
    private Long id;
    private SizeDto size;
    private ColorDto color;
    private String sku;
    private ProductImageSummary primaryImage;
    private BigDecimal price;
    private BigDecimal weightInKg;
    private Integer stockQuantity;
    private boolean active;
}