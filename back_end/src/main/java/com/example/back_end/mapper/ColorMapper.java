package com.example.back_end.mapper;

import com.example.back_end.dto.ColorDto;
import com.example.back_end.entity.Color;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ColorMapper {

    // ENTITY -> DTO
    ColorDto toDto(Color color);
}
