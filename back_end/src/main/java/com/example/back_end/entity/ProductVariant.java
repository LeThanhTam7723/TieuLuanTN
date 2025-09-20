package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

@Entity
@Table(name = "product_variants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductVariant extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne
    @JoinColumn(name = "size_id")
    private Size size;

    @ManyToOne
    @JoinColumn(name = "color_id")
    private Color color;

    private String sku;

    private BigDecimal price;

    private Integer stockQuantity;

    private BigDecimal weightInKg;

    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean active;

    @OneToMany(mappedBy = "variant", cascade = CascadeType.ALL)
    @Fetch(FetchMode.SUBSELECT)
    private List<ProductImage> images = new ArrayList<>();
}