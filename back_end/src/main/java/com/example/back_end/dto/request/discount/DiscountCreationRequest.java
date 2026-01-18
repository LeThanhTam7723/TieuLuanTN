package com.example.back_end.dto.request.discount;

import com.example.back_end.constant.DiscountType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiscountCreationRequest {
    private String code;
    private String description;
    private DiscountType discountType;
    private String discountName;
    private BigDecimal discountValue;
    private BigDecimal minimumOrderAmount;
    private Integer usageLimit;
    private boolean active;
} 