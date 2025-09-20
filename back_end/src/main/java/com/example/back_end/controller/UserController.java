package com.example.back_end.controller;

import com.example.back_end.dto.request.admin.AdminUpdateUserRequest;
import com.example.back_end.dto.request.admin.AdminUserCreationRequest;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.dto.request.user.UserCreationRequest;
import com.example.back_end.dto.request.user.ChangePasswordRequest;
import com.example.back_end.dto.request.user.UpdateUserProfileRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.User;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.user.IUserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.domain.Pageable;
import com.example.back_end.dto.response.PageResponse;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository userRepository;
    private final IUserService userService;

    /**
     * Method to create a new user
     *
     * @param request: User creation request containing user details
     * @return JSON body contains created user information
     */
    @PostMapping("/createUser")
    public ResponseEntity<ApiResponse<UserResponse>> createUser(
            @RequestBody @Valid UserCreationRequest request) {
        try {
            User user = userService.createRequest(request);
            List<UserResponse> dtos = userService.getConvertedUsers(List.of(user));
            UserResponse dto = dtos.get(0);

            return ResponseEntity.ok(
                    ApiResponse.<UserResponse>builder()
                            .code(0)
                            .message("User created successfully")
                            .data(dto)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to create user", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserResponse>builder()
                            .code(1)
                            .message("Failed to create user: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method to get all Users with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of User DTOs
     */
    @GetMapping("/all")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> getAllUsers(Pageable pageable) {
        try {
            PageResponse<UserResponse> userPage = userService.getAllUsers(pageable);

            return ResponseEntity.ok(
                    ApiResponse.<PageResponse<UserResponse>>builder()
                            .code(0)
                            .message("User list retrieved successfully")
                            .data(userPage)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to retrieve users", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<PageResponse<UserResponse>>builder()
                            .code(1)
                            .message("Failed to retrieve users: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method to get user by ID
     *
     * @return JSON body contains user information
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ApiResponse<UserResponse>> getUserById(
            @PathVariable Long userId) {
        try {
            User user = userService.getUserById(userId);
            List<UserResponse> dtos = userService.getConvertedUsers(List.of(user));
            UserResponse dto = dtos.get(0);

            return ResponseEntity.ok(
                    ApiResponse.<UserResponse>builder()
                            .code(0)
                            .message("User retrieved successfully")
                            .data(dto)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to retrieve user with id: " + userId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserResponse>builder()
                            .code(1)
                            .message("Failed to retrieve user: " + e.getMessage())
                            .build());
        }
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser() {
        try {
            UserResponse userDto = userService.getCurrentUser();
            return ResponseEntity.ok(
                    ApiResponse.<UserResponse>builder()
                            .code(0)
                            .message("Lấy thông tin người dùng thành công")
                            .data(userDto)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to get current user", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserResponse>builder()
                            .code(1)
                            .message("Không thể lấy thông tin người dùng: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method to update user profile
     *
     * @param request: User profile update request containing fields to update
     * @return JSON body contains updated user information
     */
    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> updateProfile(
            @RequestBody @Valid UpdateUserProfileRequest request) {
        try {
            UserResponse currentUser = userService.getCurrentUser();
            UserResponse updatedUser = userService.updateProfile(currentUser.getId(), request);
            return ResponseEntity.ok(
                    ApiResponse.<UserResponse>builder()
                            .code(0)
                            .message("Cập nhật thông tin thành công")
                            .data(updatedUser)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to update profile", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserResponse>builder()
                            .code(1)
                            .message("Không thể cập nhật thông tin: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method to change user's password
     *
     * @param request: Password change request containing old and new passwords
     * @return No content if password changed successfully
     */
    @PutMapping("/me/password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @RequestBody @Valid ChangePasswordRequest request) {
        try {
            UserResponse currentUser = userService.getCurrentUser();
            ApiResponse<Void> response = userService.changePassword(currentUser.getId(), request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Failed to change password", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Void>builder()
                            .code(1)
                            .message("Không thể đổi mật khẩu: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method to update user's avatar
     *
     * @param file: New avatar image file
     * @return JSON body contains updated user information
     */
    @PutMapping(value = "/me/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserResponse>> updateAvatar(
            @RequestParam("file") MultipartFile file) {
        try {
            // Kiểm tra định dạng file
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<UserResponse>builder()
                                .code(1)
                                .message("File không phải là hình ảnh")
                                .build());
            }

            // Kiểm tra kích thước file (tối đa 5MB)
            if (file.getSize() > 5 * 1024 * 1024) {
                return ResponseEntity.badRequest()
                        .body(ApiResponse.<UserResponse>builder()
                                .code(1)
                                .message("Kích thước file quá lớn (tối đa 5MB)")
                                .build());
            }

            UserResponse currentUser = userService.getCurrentUser();
            UserResponse updatedUser = userService.updateAvatar(currentUser.getId(), file);
            return ResponseEntity.ok(
                    ApiResponse.<UserResponse>builder()
                            .code(0)
                            .message("Cập nhật ảnh đại diện thành công")
                            .data(updatedUser)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to update avatar", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserResponse>builder()
                            .code(1)
                            .message("Không thể cập nhật ảnh đại diện: " + e.getMessage())
                            .build());
        }
    }

    @PostMapping("/existUser")
    ApiResponse<Boolean> existUser(@RequestParam("email") String email) {
        boolean rs = true;
        if (userRepository.findByEmail(email).isEmpty()) {
            rs = false;
        }
        return ApiResponse.<Boolean>builder().result(rs).build();
    }

    /**
     * Method to soft-delete a user by ID
     *
     * @param userId: ID of the user to be soft-deleted
     * @return JSON body indicates success or failure
     */
    @DeleteMapping("/{userId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.ok(
                    ApiResponse.<Void>builder()
                            .code(0)
                            .message("Người dùng đã được xóa mềm thành công")
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to soft delete user with id: " + userId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Void>builder()
                            .code(1)
                            .message("Không thể xóa người dùng: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method for Admin to create a new user with specific roles and active status
     *
     * @param request: AdminUserCreationRequest containing user details and roles
     * @return JSON body indicates success or failure with UserResponse
     */
    @PostMapping("/admin/create")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> adminCreateUser(@RequestBody @Valid AdminUserCreationRequest request) {
        try {
            UserResponse createdUser = userService.adminCreateUser(request);
            return ResponseEntity.ok(
                    ApiResponse.<UserResponse>builder()
                            .code(0)
                            .message("Tạo người dùng thành công")
                            .data(createdUser)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to create user by admin", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserResponse>builder()
                            .code(1)
                            .message("Không thể tạo người dùng: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method for Admin to update an existing user's information
     *
     * @param userId: ID of the user to be updated
     * @param request: AdminUpdateUserRequest containing updated user details
     * @return JSON body indicates success or failure with UserResponse
     */
    @PutMapping("/admin/{userId}")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<UserResponse>> adminUpdateUser(
            @PathVariable Long userId,
            @RequestBody @Valid AdminUpdateUserRequest request) {
        try {
            UserResponse updatedUser = userService.adminUpdateUser(userId, request);
            return ResponseEntity.ok(
                    ApiResponse.<UserResponse>builder()
                            .code(0)
                            .message("Cập nhật thông tin người dùng thành công")
                            .data(updatedUser)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to update user by admin with id: " + userId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<UserResponse>builder()
                            .code(1)
                            .message("Không thể cập nhật thông tin người dùng: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method for Admin to reset a user's password
     *
     * @param userId: ID of the user whose password needs to be reset
     * @param newPassword: The new password to set for the user
     * @return JSON body indicates success or failure
     */
    @PutMapping("/admin/{userId}/reset-password")
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> adminResetPassword(
            @PathVariable Long userId,
            @RequestParam String newPassword) {
        try {
            userService.adminResetPassword(userId, newPassword);
            return ResponseEntity.ok(
                    ApiResponse.<Void>builder()
                            .code(0)
                            .message("Đặt lại mật khẩu thành công cho người dùng " + userId)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to reset password for user id: " + userId, e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<Void>builder()
                            .code(1)
                            .message("Không thể đặt lại mật khẩu: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Method for Admin to search users by keyword across multiple fields (username, fullname, email, phone).
     * This includes inactive accounts.
     *
     * @param keyword: The search term
     * @param pageable: Pagination information (page, size, sort)
     * @return A PageResponse containing matching UserResponse objects
     */
    @GetMapping("/admin/search") // Endpoint cho chức năng tìm kiếm của admin
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')") // Chỉ admin mới được phép
    public ResponseEntity<ApiResponse<PageResponse<UserResponse>>> searchUsers(
            @RequestParam(value = "keyword", required = false) String keyword,
            @PageableDefault(size = 10, page = 0) Pageable pageable) {
        try {
            PageResponse<UserResponse> result = userService.searchUsers(keyword, pageable);
            return ResponseEntity.ok(
                    ApiResponse.<PageResponse<UserResponse>>builder()
                            .code(0)
                            .message("Tìm kiếm người dùng thành công")
                            .data(result)
                            .build()
            );
        } catch (Exception e) {
            log.error("Failed to search users", e);
            return ResponseEntity.badRequest()
                    .body(ApiResponse.<PageResponse<UserResponse>>builder()
                            .code(1)
                            .message("Không thể tìm kiếm người dùng: " + e.getMessage())
                            .build());
        }
    }

    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    @PatchMapping("/{userId}/toggle-active")
    ApiResponse<Void> toggleUserActiveStatus(@PathVariable Long userId) {
        userService.toggleUserActiveStatus(userId);
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Cập nhật trạng thái người dùng thành công")
                .build();
    }
}
