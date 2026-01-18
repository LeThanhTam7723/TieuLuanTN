package com.example.back_end.controller;

import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.refund.RefundResponse;
import com.example.back_end.service.refund.IRefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/refunds")
@RequiredArgsConstructor
public class RefundController {
    private final IRefundService refundService;
    @PostMapping
    public ApiResponse<RefundResponse> requestRefund(
            @RequestBody RefundRequest dto) {
        return ApiResponse.<RefundResponse>builder()
                .code(0)
                .result(refundService.requestRefund(dto))
                .build();
    }

    @PutMapping("/{id}/approve")
    public ApiResponse<Void> approve(@PathVariable Long id) {
        refundService.approveRefund(id);
        return ApiResponse.<Void>builder()
                .code(0)
                .build();
    }

    @PutMapping("/{id}/reject")
    public ApiResponse<Void> reject(@PathVariable Long id) {
        refundService.rejectRefund(id);
        return ApiResponse.<Void>builder()
                .code(0)
                .build();
    }
}
