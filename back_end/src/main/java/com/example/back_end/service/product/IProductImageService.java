package com.example.back_end.service.product;

import com.example.back_end.dto.request.product.ProductImageCreationRequest;
import com.example.back_end.dto.request.product.ProductImageUpdateRequest;
import com.example.back_end.dto.response.product.ProductImageResponse;
import com.example.back_end.dto.response.product.ProductImageSummary;
import com.example.back_end.entity.ProductImage;
import com.example.back_end.repository.ProductImageRepository;

import java.util.List;

public interface IProductImageService {
    ProductImageResponse createImage(Long productId, Long variantId, boolean isActive, boolean isPrimary, ProductImageCreationRequest request);

    ProductImageResponse updateImage(Long id, Boolean isActive, Boolean isPrimary, ProductImageUpdateRequest request);

    void deleteImage(Long id);

    ProductImageResponse getImageById(Long id);

    List<ProductImageSummary> getImagesByProduct(Long productId);

    void deleteImagesByProduct(Long productId);

    void toggleImageStatus(Long id);

    void setPrimaryImage(Long id);

    List<ProductImageResponse> getImagesByVariantId(Long variantId);

    ProductImage findFirstByProduct_Id(Long productId);
} 