package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "category_images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryImage extends BaseEntity  {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String imageUrl;

    @Column(name = "public_id")
    private String publicId;

    private String altText;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}

