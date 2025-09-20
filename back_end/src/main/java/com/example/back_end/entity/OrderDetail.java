package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "order_details")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_order_detail", nullable = false)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_order", nullable = false, referencedColumnName = "id")
    private Order idOrder;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_product", nullable = false)
    private ProductVariant idProduct;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Column(name = "totalPrice", nullable = false)
    private BigDecimal totalPrice;
}
