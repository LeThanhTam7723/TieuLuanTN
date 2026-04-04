package com.example.back_end.entity;

import com.example.back_end.constant.RefundStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "refunds")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refund extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String reason;

    @Column(nullable = false, length = 500)
    private String description;

    @Enumerated(EnumType.STRING)
    private RefundStatus status;

    @Builder.Default
    @OneToMany(
            mappedBy = "refund",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<RefundImage> images = new ArrayList<>();

}
