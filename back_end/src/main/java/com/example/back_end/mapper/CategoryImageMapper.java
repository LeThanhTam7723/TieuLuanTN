package com.example.back_end.mapper;

import com.example.back_end.dto.request.category.CategoryImageCreationRequest;
import com.example.back_end.dto.response.category.CategoryImageResponse;
import com.example.back_end.entity.CategoryImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryImageMapper {
    
    // CREATE MAPPING
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "publicId", ignore = true)
    CategoryImage toEntity(CategoryImageCreationRequest request);

    // RESPONSE MAPPING
    CategoryImageResponse toResponse(CategoryImage image);
}
