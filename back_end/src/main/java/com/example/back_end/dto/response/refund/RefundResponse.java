package com.example.back_end.dto.response.refund;

import com.example.back_end.constant.RefundStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundResponse {
    private Long refundId;
    private RefundStatus status;
    private String reason;
}
