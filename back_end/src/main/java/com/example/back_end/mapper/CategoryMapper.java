package com.example.back_end.mapper;

import com.example.back_end.dto.response.category.*;
import com.example.back_end.entity.Category;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    // ENTITY -> RESPONSE
    @Mapping(target = "parentId", source = "parent", qualifiedByName = "parentToId")
    @Mapping(target = "genderId", source = "gender.id")
    @Mapping(target = "parentName", source = "parent.name")
    CategoryResponse toResponse(Category category);

    @Mapping(target = "parentId", source = "parent", qualifiedByName = "parentToId")
    @Mapping(target = "genderId", source = "gender.id")
    @Mapping(target = "parentName", source = "parent.name")
    CategorySummary toSummary(Category category);

    List<CategoryResponse> toResponseList(List<Category> categories);

    List<CategorySummary> toSummaryList(List<Category> categories);

    // CUSTOM MAPPING
    @Named("parentToId")
    default Long parentToId(Category parent) {
        return parent != null ? parent.getId() : null;
    }
}
