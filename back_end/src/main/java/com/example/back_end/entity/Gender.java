package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "genders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Gender extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    private String description;

    private String slug;

    @OneToMany(mappedBy = "gender", cascade = CascadeType.ALL)
    private List<Product> products = new ArrayList<>();
}
