package com.example.back_end.dto.response.discount;

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
public class DiscountResponseAdmin {
    private Long id;
    private String code;
    private DiscountType discountType;
    private String discountName;
    private String description;
    private double discountValue;
    private BigDecimal minimumOrderAmount;
    private Integer usageLimit;
    private Boolean active;
}
