package com.example.back_end.mapper;

import com.example.back_end.dto.BrandDto;
import com.example.back_end.dto.ColorDto;
import com.example.back_end.dto.SizeDto;
import com.example.back_end.dto.request.product.*;
import com.example.back_end.dto.response.product.*;
import com.example.back_end.entity.*;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        uses = {BrandMapper.class, GenderMapper.class,
                CategoryMapper.class, ProductImageMapper.class,
                ProductVariantMapper.class})
public interface ProductMapper {

    // CREATE
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "gender", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "variants", ignore = true)
    Product toEntity(ProductCreationRequest request);

    // UPDATE
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "brand", ignore = true)
    @Mapping(target = "gender", ignore = true)
    @Mapping(target = "categories", ignore = true)
    @Mapping(target = "images", ignore = true)
    @Mapping(target = "variants", ignore = true)
    void updateFromRequest(ProductUpdateRequest request, @MappingTarget Product product);

    // RESPONSE MAPPINGS
    @Mapping(target = "primaryImage", source = "images", qualifiedByName = "findPrimaryImage")
    ProductResponse toResponse(Product product);

    @Mapping(target = "brand", source = "brand")
    @Mapping(target = "gender", source = "gender")
    @Mapping(target = "categories", source = "categories")
    @Mapping(target = "images", source = "images")
    @Mapping(target = "variants", source = "variants")
    @Mapping(target = "slug", source = "slug")
    @Mapping(target = "basePrice", source = "basePrice")
    ProductDetailResponse toDetailResponse(Product product);

    @Mapping(target = "brandName", source = "brand.name")
    @Mapping(target = "genderName", source = "gender.name")
    @Mapping(target = "primaryImage", expression = "java(findPrimaryImage(product.getImages()))")
    ProductSummary toSummary(Product product);

    // LIST MAPPINGS
    List<ProductSummary> toSummaryList(List<Product> products);

    // CUSTOM MAPPING LOGIC
    @Named("findPrimaryImage")
    default ProductImageSummary findPrimaryImage(List<ProductImage> images) {
        if (images == null || images.isEmpty()) {
            return null;
        }
        return images.stream()
                .filter(ProductImage::isPrimary)
                .findFirst()
                .map(image -> ProductImageSummary.builder()
                        .id(image.getId())
                        .imageUrl(image.getImageUrl())
                        .altText(image.getAltText())
                        .build())
                .orElse(null);
    }
}