package com.example.back_end.entity;


import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "sizes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Size extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @OneToMany(mappedBy = "size")
    private List<ProductVariant> variants = new ArrayList<>();
}
