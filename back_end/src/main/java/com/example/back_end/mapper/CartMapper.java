package com.example.back_end.mapper;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.entity.CartDetail;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = {ProductVariantMapper.class})
public interface CartMapper {
    @Mapping(target = "product", source = "idProduct")
    CartDetailDto toDto(CartDetail cartDetail);
    List<CartDetailDto> toDtoFromEntity(List<CartDetail> cartDetail);
}
