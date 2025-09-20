package com.example.back_end.dto.request.discount;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCreationRequest {
    private String code;
    private String discountName;
    private String description;
    private double salePercent;
} 