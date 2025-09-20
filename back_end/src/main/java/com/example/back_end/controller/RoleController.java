package com.example.back_end.controller;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.role.RoleResponse;
import com.example.back_end.service.role.IRoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/roles") // Endpoint cho roles
public class RoleController {
    private final IRoleService roleService;

    /**
     * Get all roles (for Admin to populate dropdowns/checkboxes)
     *
     * @return List of RoleResponse
     */
    @GetMapping
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<List<RoleResponse>>> getAllRoles() {
        try {
            List<RoleResponse> roles = roleService.getAllRoles();
            return ResponseEntity.ok(
                    ApiResponse.<List<RoleResponse>>builder()
                            .code(0)
                            .message("Lấy danh sách vai trò thành công")
                            .data(roles)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to fetch roles", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<List<RoleResponse>>builder()
                            .code(1)
                            .message("Không thể lấy danh sách vai trò: " + e.getMessage())
                            .build());
        }
    }
}