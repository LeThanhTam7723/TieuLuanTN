package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "status")
public class Status {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_status", nullable = false)
    private Integer id;

    @Column(name = "name", nullable = false, length = 50)
    private String name;

}
