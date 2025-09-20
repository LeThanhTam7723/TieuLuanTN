package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="discount")
public class Discount {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",nullable = false)
    private Long id;
    @Column(name = "code",nullable = false)
    private String code;
    @Column(name = "discountName",nullable = false)
    private String discountName;
    @Column(name = "description",nullable = false)
    private String description;
    @Column(name = "salePercent",nullable = false)
    private double salePercent;
}
