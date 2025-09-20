package com.example.back_end.dto.request.category;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryImageUpdateRequest {
    @Size(max = 255, message = "Image URL cannot exceed 255 characters")
    private String imageUrl;

    @Size(max = 100, message = "Alt text cannot exceed 100 characters")
    private String altText;

    private MultipartFile imageFile;
}
