package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "product_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Column(name = "public_id")
    private String publicId;

    private String altText;

    @Column(name = "is_primary", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean primary;

    @Column(name = "is_active", nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id")
    private ProductVariant variant;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "color_id")
    private Color color;

    @Override
    public void prePersist() {
        super.prePersist();
        if (product == null && variant == null) {
            throw new IllegalStateException("ProductImage must be associated with either a Product or a ProductVariant");
        }
    }
}
