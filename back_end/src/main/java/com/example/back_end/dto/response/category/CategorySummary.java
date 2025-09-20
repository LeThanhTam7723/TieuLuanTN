package com.example.back_end.dto.response.category;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorySummary {
    private Long id;
    private String name;
    private String description;
    private String slug;
    private String parentName;
    private CategoryImageResponse categoryImage;
    private Long parentId;
    private Long genderId;
    private boolean active;
}