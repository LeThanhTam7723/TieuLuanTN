package com.example.back_end.dto.response.category;

import com.example.back_end.entity.Category;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryImageResponse {
    private Long id;
    private String imageUrl;
    private String publicId;
    private String altText;
}