package com.example.back_end.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GenderDto {
    private Long id;
    private String name;
    private String description;
    private String slug;
} 