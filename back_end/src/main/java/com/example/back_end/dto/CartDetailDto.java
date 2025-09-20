package com.example.back_end.dto;

import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.product.ProductVariantSummary;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartDetailDto {
    private long id;
    private ProductVariantResponse product;
    private String color;
    private String size;
    private int quantity;
}
