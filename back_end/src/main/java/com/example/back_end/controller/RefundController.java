package com.example.back_end.controller;

import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.refund.RefundResponse;
import com.example.back_end.service.refund.IRefundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/refund")
@RequiredArgsConstructor
public class RefundController {
    private final IRefundService refundService;
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> requestRefund(
            @ModelAttribute RefundRequest dto) {
        refundService.requestRefund(dto);
        return ApiResponse.<Void>builder()
                .code(0)
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
    @PutMapping("/{id}/refunded")
    public ApiResponse<Void> refunded(@PathVariable Long id) {
        refundService.refundedRefund(id);
        return ApiResponse.<Void>builder()
                .code(0)
                .build();
    }
}
