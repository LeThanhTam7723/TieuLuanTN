package com.example.back_end.mapper;

import com.example.back_end.dto.BrandDto;
import com.example.back_end.entity.Brand;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BrandMapper {

    // ENTITY -> DTO
    BrandDto toDto(Brand brand);
}
