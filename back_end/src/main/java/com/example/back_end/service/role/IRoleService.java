package com.example.back_end.service.role;

import com.example.back_end.dto.response.role.RoleResponse;


import java.util.List;

public interface IRoleService {
    List<RoleResponse> getAllRoles();
}