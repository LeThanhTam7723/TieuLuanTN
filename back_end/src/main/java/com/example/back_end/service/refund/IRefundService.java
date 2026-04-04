package com.example.back_end.service.refund;

import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.refund.RefundResponse;

import java.util.List;

public interface IRefundService {
    void requestRefund(RefundRequest dto);
    void approveRefund(Long refundId);
    void rejectRefund(Long refundId);
    void refundedRefund(Long refundId);

}
