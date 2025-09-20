package com.example.back_end.service.category;

import com.example.back_end.dto.request.category.CategoryImageCreationRequest;
import com.example.back_end.dto.request.category.CategoryImageUpdateRequest;
import com.example.back_end.dto.response.category.CategoryImageResponse;
import org.springframework.web.multipart.MultipartFile;

public interface ICategoryImageService {
    CategoryImageResponse createImage(Long categoryId, CategoryImageCreationRequest request);

    CategoryImageResponse updateImage(Long categoryId, CategoryImageUpdateRequest request);

    void deleteImage(Long categoryId);

    CategoryImageResponse getCategoryImage(Long categoryId);
} 