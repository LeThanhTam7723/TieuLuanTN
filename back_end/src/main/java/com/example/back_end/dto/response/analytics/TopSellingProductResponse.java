package com.example.back_end.dto.response.analytics;

import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.entity.ProductVariant;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TopSellingProductResponse {
    private List<ProductVariantResponse> variants; // 6 ProductVariant
    private List<Long> quantities;
}
