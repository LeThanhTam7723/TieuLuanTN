package com.example.back_end.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColorDto {
    private Long id;
    private String name;
    private String hexCode;
} 