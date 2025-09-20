package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "brands")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Brand extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    private String website;

    @OneToMany(mappedBy = "brand", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
}
