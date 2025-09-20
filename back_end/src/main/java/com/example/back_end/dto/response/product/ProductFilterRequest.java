package com.example.back_end.dto.response.product;

import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductFilterRequest {
    private List<Long> colorIds;
    private List<Long> sizeIds;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;
}
