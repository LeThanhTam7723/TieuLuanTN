package com.example.back_end.dto.response.analytics;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AnalyticsResponse {
    private long totalCustomers;
    private long totalProducts;
    private long totalOrders;
    private BigDecimal totalRevenue;
}
