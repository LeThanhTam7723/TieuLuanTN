package com.example.back_end.constant;

public enum RefundStatus {
    REQUESTED,   // khách gửi yêu cầu
    APPROVED,    // admin duyệt
    REJECTED,    // từ chối
    REFUNDED
}
