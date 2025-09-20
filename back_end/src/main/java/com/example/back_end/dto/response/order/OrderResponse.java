package com.example.back_end.dto.response.order;

import com.example.back_end.dto.StatusDto;
import com.example.back_end.dto.response.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {
    private Long id;
    private UserResponse user;
    private String receiver;
    private String address;
    private String phone;
    private LocalDate dateOrder;
    private String paymentMethod;
    private StatusDto status;
    private BigDecimal totalAmount;
    private List<OrderDetailResponse> orderDetails;
} 