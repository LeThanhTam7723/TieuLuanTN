package com.example.back_end.mapper;

import com.example.back_end.dto.request.admin.AdminUserCreationRequest;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.dto.request.user.UserCreationRequest;
import com.example.back_end.entity.User;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring", imports = Collectors.class)
public interface UserMapper {

    // CREATE - cho người dùng tạo
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
//    @Mapping(target = "active", constant = "false")
    @Mapping(target = "active", source = "active")
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "roles", ignore = true)
    User toEntity(UserCreationRequest request);

    // CREATE - cho Admin tạo
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "password", ignore = true)
    @Mapping(target = "imageUrl", ignore = true)
    @Mapping(target = "roles", ignore = true) // Sẽ được xử lý thủ công trong Service
    User toEntity(AdminUserCreationRequest request);

    // DTO RESPONSE

    UserResponse toResponse(User user);

    List<UserResponse> toResponseList(List<User> users);
}
