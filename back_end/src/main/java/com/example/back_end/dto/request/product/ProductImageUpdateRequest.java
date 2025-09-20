package com.example.back_end.dto.request.product;

import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageUpdateRequest {
    private MultipartFile imageFile;

    @Size(max = 100, message = "Alt text cannot exceed 100 characters")
    private String altText;

    private boolean primary = false;

    private Long colorId;
}
