package com.example.back_end.dto.request.product;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VariantFilterRequest {
    private Long colorId;
    private Long sizeId;
    private Boolean active;
} 