package com.example.back_end.dto;

import com.example.back_end.dto.OrderDetailDto;
import com.example.back_end.dto.StatusDto;
import com.example.back_end.dto.response.user.UserResponse;

import com.example.back_end.entity.PaymentMethod;
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
public class OrderAdminDetailDto {
    private Long id;
    private UserResponse user;
    private String receiver;
    private String address;
    private String phone;
    private LocalDate dateOrder;
    private PaymentMethodDto paymentMethod;
    private StatusDto status;
    private BigDecimal totalOrderValue;
    private List<OrderDetailDto> orderDetails;
}