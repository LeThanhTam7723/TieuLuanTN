package com.example.back_end.mapper;

import com.example.back_end.dto.OrderDto;
import com.example.back_end.dto.response.order.OrderResponse;
import com.example.back_end.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {
    OrderDto toDto(Order order);

    OrderResponse toResponse(Order order);
}
