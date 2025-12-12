package com.example.back_end.controller;

import com.example.back_end.dto.request.user.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.analytics.AnalyticsResponse;
import com.example.back_end.dto.response.analytics.RevenueChartResponse;
import com.example.back_end.dto.response.analytics.RevenueResponse;
import com.example.back_end.dto.response.analytics.TopSellingProductResponse;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.entity.User;
import com.example.back_end.service.analytics.AnalyticsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/analytics")
public class AnalyticsController {
    private final AnalyticsService analyticsService;
    @GetMapping("/admin")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<AnalyticsResponse> getAnalytics() {
        AnalyticsResponse response = analyticsService.getAnalytics();
        return ApiResponse.<AnalyticsResponse>builder()
                .code(0)
                .result(response)
                .build();

    }
    @GetMapping("/revenue-6-months")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<RevenueChartResponse> getRevenueLast6Months() {
        return ApiResponse.<RevenueChartResponse>builder()
                .code(0)
                .result(analyticsService.getRevenueChart())
                .build();
    }
    @GetMapping("/topBestSeller")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ApiResponse<TopSellingProductResponse> getTopSellingVariants() {
        return ApiResponse.<TopSellingProductResponse>builder()
                .code(0)
                .result(analyticsService.getTopSellingVariants())
                .build();
    }
}
