package com.example.back_end.mapper;

import com.example.back_end.dto.OrderDetailDto;
import com.example.back_end.entity.OrderDetail;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface OrderDetailMapper {
    OrderDetailDto toDto(OrderDetail orderDetail);
}
