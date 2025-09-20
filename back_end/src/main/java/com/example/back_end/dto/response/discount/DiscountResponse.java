package com.example.back_end.dto.response.discount;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountResponse {
    private Long id;
    private String code;
    private String discountName;
    private String description;
    private double salePercent;
} 