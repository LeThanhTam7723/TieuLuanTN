package com.example.back_end.service.analytics;

import com.example.back_end.dto.response.analytics.AnalyticsResponse;
import com.example.back_end.dto.response.analytics.RevenueChartResponse;
import com.example.back_end.dto.response.analytics.RevenueResponse;
import com.example.back_end.dto.response.analytics.TopSellingProductResponse;

import java.util.List;

public interface IAnalyticsService {
    AnalyticsResponse getAnalytics();
//    List<RevenueResponse> getRevenueLast6Months();
    RevenueChartResponse getRevenueChart();
    TopSellingProductResponse getTopSellingVariants();


}
