package com.example.back_end.mapper;

import com.example.back_end.dto.request.product.ProductImageCreationRequest;
import com.example.back_end.dto.request.product.ProductImageUpdateRequest;
import com.example.back_end.dto.response.product.ProductImageResponse;
import com.example.back_end.dto.response.product.ProductImageSummary;
import com.example.back_end.entity.ProductImage;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProductImageMapper {

    // CREATE MAPPING
    @Mapping(target = "id", source = "productId")
    @Mapping(target = "variant.id", source = "variantId")
    @Mapping(target = "color.id", source = "colorId")
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    ProductImage toEntity(ProductImageCreationRequest request);

    // RESPONSE MAPPING
    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "variantId", source = "variant.id")
    @Mapping(target = "colorId", source = "variant.color.id")
    ProductImageResponse toResponse(ProductImage image);

    List<ProductImageResponse> toResponseList(List<ProductImage> images);

    // SUMMARY MAPPING
    ProductImageSummary toSummary(ProductImage image);

    List<ProductImageSummary> toSummaryList(List<ProductImage> images);
}
