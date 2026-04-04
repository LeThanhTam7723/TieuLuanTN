package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table (name = "refund_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundImage extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // URL ảnh (S3 / Cloudinary / local)
    @Column(nullable = false)
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "refund_id", nullable = false)
    private Refund refund;
}
