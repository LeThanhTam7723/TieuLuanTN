package com.example.back_end.entity;

import com.example.back_end.constant.DiscountType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name="discount")
public class Discount extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id",nullable = false)
    private Long id;
    @Column(name = "code",nullable = false)
    private String code;
    @Enumerated(EnumType.STRING)
    private DiscountType discountType;
    @Column(name = "discountName",nullable = false)
    private String discountName;
    @Column(name = "description",nullable = false)
    private String description;
    @Column(name = "discountValue",nullable = false)
    private BigDecimal discountValue; // giá trị giảm (nếu là số tiền hoặc %)
    @Column(name = "minimumOrderAmount")
    private BigDecimal minimumOrderAmount; // điều kiện áp dụng đơn hàng tối thiểu
    @Column(name = "usageLimit",nullable = false)
    private Integer usageLimit; // số lần sử dụng tối đa
    @Column(name = "usedCount")
    private Integer usedCount; // đã dùng bao nhiêu lần
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT FALSE")
    private Boolean active;
}
