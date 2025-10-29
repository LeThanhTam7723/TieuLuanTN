package com.example.back_end.config;

import com.example.back_end.dto.response.product.ProductImageSummary;
import com.example.back_end.entity.ProductImage;
import org.mapstruct.Named;

import java.util.List;

public class ImageMapperUtil {
    @Named("findPrimaryImage")
    public static ProductImageSummary findPrimaryImage(List<ProductImage> images) {
        if (images == null || images.isEmpty()) return null;
        return images.stream()
                .filter(ProductImage::isPrimary)
                .findFirst()
                .map(img -> ProductImageSummary.builder()
                        .id(img.getId())
                        .imageUrl(img.getImageUrl())
                        .altText(img.getAltText())
                        .build())
                .orElse(null);
    }
}
