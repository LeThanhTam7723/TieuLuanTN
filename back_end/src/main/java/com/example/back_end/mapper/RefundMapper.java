package com.example.back_end.mapper;

import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.refund.RefundResponse;
import com.example.back_end.entity.Refund;
import com.example.back_end.entity.RefundImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RefundMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "REQUESTED")
    @Mapping(target = "images", ignore = true)
    Refund toEntity(RefundRequest dto);
    @Mapping(
            target = "imageUrls",
            expression = "java(mapImageUrls(refund.getImages()))"
    )
    RefundResponse toDto(Refund refund);
    default List<String> mapImageUrls(List<RefundImage> images) {
        if (images == null) return List.of();
        return images.stream()
                .map(RefundImage::getImageUrl)
                .toList();
    }
}
