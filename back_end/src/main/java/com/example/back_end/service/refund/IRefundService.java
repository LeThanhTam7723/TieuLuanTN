package com.example.back_end.service.refund;

import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.refund.RefundResponse;

public interface IRefundService {
    RefundResponse requestRefund(RefundRequest dto);
    void approveRefund(Long refundId);
    void rejectRefund(Long refundId);
}
