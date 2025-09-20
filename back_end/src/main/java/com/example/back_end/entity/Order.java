package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_user", nullable = false, referencedColumnName = "id")
    private User idUser;

    @Column(name = "receiver", nullable = false)
    private String receiver;

    @Column(name = "address", nullable = false)
    private String address;

    @Column(name = "phone", nullable = false)
    private String phone;

    @Column(name = "dateOrder", nullable = false)
    private LocalDate dateOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_payment_method", nullable = false)
    private PaymentMethod idPaymentMethod;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_status", nullable = false)
    private Status idStatus;
}
