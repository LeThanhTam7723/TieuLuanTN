package com.example.back_end.mapper;

import com.example.back_end.dto.request.product.ProductVariantCreationRequest;
import com.example.back_end.dto.request.product.ProductVariantUpdateRequest;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.product.ProductVariantSummary;
import com.example.back_end.entity.ProductVariant;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        uses = {SizeMapper.class, ColorMapper.class, ProductImageMapper.class})
public interface ProductVariantMapper {

    // CREATE MAPPING
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "color.id", source = "colorId")
    @Mapping(target = "size.id", source = "sizeId")
    ProductVariant toEntity(ProductVariantCreationRequest request);

    // UPDATE MAPPING
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "color.id", ignore = true)
    @Mapping(target = "size.id", ignore = true)
    void updateVariantFromRequest(ProductVariantUpdateRequest request, @MappingTarget ProductVariant variant);

    // RESPONSE MAPPING
    @Mapping(target = "color", source = "color")
    @Mapping(target = "size", source = "size")
    ProductVariantResponse toResponse(ProductVariant variant);

    List<ProductVariantResponse> toResponseList(List<ProductVariant> variants);

    // SUMMARY MAPPING
    @Mapping(target = "size", source = "size")
    @Mapping(target = "color", source = "color")
    ProductVariantSummary toSummary(ProductVariant variant);

    List<ProductVariantSummary> toSummaryList(List<ProductVariant> variants);

    // MANUAL ID BINDING (nếu cần set thủ công để tránh lazy-load null)
    @AfterMapping
    default void mapVariantAssociations(ProductVariantCreationRequest request, @MappingTarget ProductVariant variant) {
        if (variant.getColor() == null && request.getColorId() != null) {
            variant.setColor(new com.example.back_end.entity.Color());
            variant.getColor().setId(request.getColorId());
        }
        if (variant.getSize() == null && request.getSizeId() != null) {
            variant.setSize(new com.example.back_end.entity.Size());
            variant.getSize().setId(request.getSizeId());
        }
    }
}
