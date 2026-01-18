package com.example.back_end.service.analytics;

import com.example.back_end.dto.response.analytics.AnalyticsResponse;
import com.example.back_end.dto.response.analytics.RevenueChartResponse;
import com.example.back_end.dto.response.analytics.RevenueResponse;
import com.example.back_end.dto.response.analytics.TopSellingProductResponse;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.entity.ProductVariant;
import com.example.back_end.mapper.ProductVariantMapper;
import com.example.back_end.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class AnalyticsService implements IAnalyticsService{
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductVariantMapper variantMapper;

    @Override
    public AnalyticsResponse getAnalytics() {
        Long userNum = userRepository.countActiveUsersByRole("USER");
        Long proActNum = productRepository.countByActiveTrue();
        Long orderNum = orderRepository.count();
        BigDecimal revenue = orderRepository.getTotalRevenuePaidOrders();
        return AnalyticsResponse.builder()
                .totalCustomers(userNum)
                .totalProducts(proActNum)
                .totalOrders(orderNum)
                .totalRevenue(revenue != null ? revenue : BigDecimal.ZERO) // tránh null
                .build();
    }

//    @Override
//    public List<RevenueResponse> getRevenueLast6Months() {
//        LocalDate startDate = LocalDate.now().minusMonths(6).withDayOfMonth(1);
//        return orderRepository.getRevenueLast6Months(startDate);
//    }
    public RevenueChartResponse getRevenueChart() {
        List<Object[]> rows = orderRepository.getRevenueLast6Months();

        List<String> months = new ArrayList<>();
        List<BigDecimal> revenues = new ArrayList<>();

        for (Object[] row : rows) {
            months.add((String) row[0]);
            revenues.add((BigDecimal) row[1]);
        }

        return new RevenueChartResponse(months, revenues);
    }

    @Override
    public TopSellingProductResponse getTopSellingVariants() {
        List<Object[]> rawData = orderDetailRepository.findTopSellingVariants();

        List<ProductVariant> variants = new ArrayList<>();
        List<Long> quantities = new ArrayList<>();

        for (Object[] row : rawData) {
            variants.add((ProductVariant) row[0]);
            quantities.add((Long) row[1]);
        }
        List<ProductVariantResponse> productVariantResponses = variantMapper.toResponseList(variants);

        return TopSellingProductResponse.builder()
                .variants(productVariantResponses)
                .quantities(quantities)
                .build();
    }

}
