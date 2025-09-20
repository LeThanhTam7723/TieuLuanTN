package com.example.back_end.dto;

import com.example.back_end.entity.OrderDetail;
import com.example.back_end.entity.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long idOrder;
    private Long userId;
    private LocalDate dateOrder;
    private String paymentMethodTypePayment;
    private String statusName;
    private List<OrderDetailDto> orderDetails;
}
