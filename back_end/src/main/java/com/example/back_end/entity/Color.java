package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "colors")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Color extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String hexCode;

    @OneToMany(mappedBy = "color")
    private List<ProductVariant> variants = new ArrayList<>();
}
