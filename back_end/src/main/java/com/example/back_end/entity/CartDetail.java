package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "cart_detail")
public class CartDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_cart", nullable = false)
    private Cart idCart;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_product", nullable = false)
    private ProductVariant idProduct;

    @Column(name = "quantity", nullable = false)
    private Integer quantity;

    @Override
    public String toString() {
        return "CartDetail{" +
                "id=" + id +
                ", idCart=" + idCart +
                ", idProduct=" + idProduct +
                ", quantity=" + quantity +
                '}';
    }
}
