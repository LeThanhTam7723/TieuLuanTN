package com.example.back_end.mapper;

import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.refund.RefundResponse;
import com.example.back_end.entity.Refund;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RefundMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "REQUESTED")
    Refund toEntity(RefundRequest dto);
    RefundResponse toDto(Refund refund);
}
