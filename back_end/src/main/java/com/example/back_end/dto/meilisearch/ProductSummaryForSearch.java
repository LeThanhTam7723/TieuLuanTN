package com.example.back_end.dto.meilisearch;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummaryForSearch {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private String brandName;
    private String slug;
    private String primaryImageUrl; // Chỉ lấy URL ảnh
    private String genderName;
    private boolean featured;
    private boolean active;
}

