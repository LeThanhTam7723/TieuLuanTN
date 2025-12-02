package com.example.back_end.dto.response.product;

import com.example.back_end.dto.ColorDto;
import com.example.back_end.dto.SizeDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductCard {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private String brandName;
    private BigDecimal rating;
    private String slug;
    private ProductImageSummary primaryImage;
    private String genderName;
    private boolean featured;
    private boolean active;
}
