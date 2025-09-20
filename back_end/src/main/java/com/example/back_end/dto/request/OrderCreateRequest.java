package com.example.back_end.dto.request;

import com.example.back_end.entity.PaymentMethod;
import com.example.back_end.entity.Status;
import com.example.back_end.entity.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderCreateRequest {
    private Long idUser;
    private String receiver;
    private String phone;
    private String address;
    private int idPaymentMethod;
    private int idStatus;
    private double total;
}
