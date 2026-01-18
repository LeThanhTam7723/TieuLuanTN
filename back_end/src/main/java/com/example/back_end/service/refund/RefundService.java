package com.example.back_end.service.refund;

import com.example.back_end.constant.RefundStatus;
import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.refund.RefundResponse;
import com.example.back_end.entity.OrderDetail;
import com.example.back_end.entity.Refund;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.RefundMapper;
import com.example.back_end.repository.OrderDetailRepository;
import com.example.back_end.repository.RefundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RefundService implements IRefundService{
    private final OrderDetailRepository orderDetailRepository;
    private final RefundMapper refundMapper;
    private final RefundRepository refundRepository;
    @Override
    public RefundResponse requestRefund(RefundRequest dto) {
        OrderDetail orderDetail = orderDetailRepository.findById(dto.getOrderDetailId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));
        if (orderDetail.getRefund() != null) {
            throw new AppException(ErrorCode.ORDER_REFUND_EXISTED);
        }
        Refund refund = refundMapper.toEntity(dto);
        refundRepository.save(refund);

        orderDetail.setRefund(refund);

        return refundMapper.toDto(refund);
    }

    @Override
    public void approveRefund(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund không tồn tại"));

        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new RuntimeException("Refund không ở trạng thái REQUESTED");
        }
        refund.setStatus(RefundStatus.REFUNDED);

    }

    @Override
    public void rejectRefund(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund không tồn tại"));

        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new RuntimeException("Refund không ở trạng thái REQUESTED");
        }

        OrderDetail orderDetail = orderDetailRepository.findByRefund_Id(refundId)
                .orElseThrow(() -> new RuntimeException("Order item không tồn tại"));

        orderDetail.setRefund(null);

        refund.setStatus(RefundStatus.REJECTED);

    }
}
