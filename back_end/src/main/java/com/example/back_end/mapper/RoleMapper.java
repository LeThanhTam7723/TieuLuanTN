package com.example.back_end.mapper;

import com.example.back_end.dto.response.role.RoleResponse;
import com.example.back_end.entity.Role;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface RoleMapper {
    RoleResponse toResponse(Role role);
    List<RoleResponse> toResponseList(List<Role> roles);
}