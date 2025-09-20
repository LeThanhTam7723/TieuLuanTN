package com.example.back_end.mapper;

import com.example.back_end.dto.request.review.ReviewRequest;
import com.example.back_end.dto.response.review.ReviewResponse;
import com.example.back_end.entity.Review;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = Collectors.class,uses = {UserMapper.class})
public interface ReviewMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "idProduct.id", source = "idProduct")
    @Mapping(target = "user.id", source = "idUser")
    @Mapping(target = "createdAt", expression = "java(java.time.LocalDateTime.now())")
    Review toEntity(ReviewRequest request);

    @Mapping(target = "userResponse", source = "user")
    ReviewResponse toResponse(Review review);
}
