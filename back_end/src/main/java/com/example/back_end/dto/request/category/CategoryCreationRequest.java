package com.example.back_end.dto.request.category;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryCreationRequest {
    @NotBlank(message = "Category name is required")
    @Size(max = 255, message = "Category name must be less than 255 characters")
    private String name;

    @Size(max = 1000, message = "Description must be less than 1000 characters")
    private String description;

    @Size(max = 255, message = "Slug must be less than 255 characters")
    private String slug;

    private Long parentId;

    private Long genderId;

    private boolean active = true;
}
