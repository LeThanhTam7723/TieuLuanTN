package com.example.back_end.dto.response.order;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderDetailResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private BigDecimal price;
    private BigDecimal totalPrice;
} 