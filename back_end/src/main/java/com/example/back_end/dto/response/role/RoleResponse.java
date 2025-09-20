package com.example.back_end.dto.response.role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoleResponse {
    private String name; // Tên vai trò, ví dụ: "ADMIN", "USER"
    private String description; // Mô tả vai trò
}