package com.example.back_end.dto.response.product;

import com.example.back_end.service.product.ProductImageService;
import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductSummary {
    private Long id;
    private String name;
    private BigDecimal basePrice;
    private String brandName;
    private String slug;
    private ProductImageSummary primaryImage;
    private String genderName;
    private boolean featured;
    private boolean active;
}
