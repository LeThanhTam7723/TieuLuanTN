package com.example.back_end.dto.response.product;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageSummary {
    private Long id;
    private String imageUrl;
    private String altText;
    private boolean active;
}