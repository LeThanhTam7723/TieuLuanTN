package com.example.back_end.mapper;

import com.example.back_end.dto.GenderDto;
import com.example.back_end.entity.Gender;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface GenderMapper {

    // ENTITY TO DTO
    GenderDto toDto(Gender gender);
}
