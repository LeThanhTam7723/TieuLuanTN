package com.example.back_end.dto.response.product;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageResponse {
    private Long id;
    private Long productId;
    private Long variantId;
    private Long colorId;
    private String imageUrl;
    private String altText;
    private boolean primary;
    private boolean active;
}