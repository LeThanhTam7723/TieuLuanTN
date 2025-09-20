package com.example.back_end.dto.request.product;

import com.example.back_end.entity.Color;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.ProductVariant;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductImageCreationRequest {
    @NotNull(message = "Image file is required")
    private MultipartFile imageFile;

    @Size(max = 100, message = "Alt text cannot exceed 100 characters")
    private String altText;

    private boolean primary = false;

    private Long productId;

    private Long variantId;

    private Long colorId;
}