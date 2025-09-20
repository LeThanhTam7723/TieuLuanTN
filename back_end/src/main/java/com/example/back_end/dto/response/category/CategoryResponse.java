package com.example.back_end.dto.response.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private String parentName;
    private CategoryImageResponse categoryImage;
    private boolean active;
    private Long parentId;
    private Long genderId;
}
