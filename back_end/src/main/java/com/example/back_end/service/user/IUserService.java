package com.example.back_end.service.user;

import com.example.back_end.dto.request.admin.AdminUpdateUserRequest;
import com.example.back_end.dto.request.admin.AdminUserCreationRequest;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.user.UserCreationRequest;
import com.example.back_end.dto.request.user.ChangePasswordRequest;
import com.example.back_end.dto.request.user.UpdateUserProfileRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.User;
import org.springframework.data.domain.Pageable;
import com.example.back_end.dto.response.PageResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;

public interface IUserService {
    User createRequest(UserCreationRequest request);

    IntrospectResponse introspect(IntrospectRequest request) throws Exception;

    PageResponse<UserResponse> getAllUsers(Pageable pageable);

    User getUserById(Long id);

    AuthenticationResponse login(String email, String password);

    List<UserResponse> getConvertedUsers(List<User> users);

    // Lấy thông tin người dùng hiện tại
    UserResponse getCurrentUser();

    // Cập nhật thông tin cá nhân
    UserResponse updateProfile(Long userId, UpdateUserProfileRequest request);

    // Đổi mật khẩu
    ApiResponse<Void> changePassword(Long userId, ChangePasswordRequest request);

    // Cập nhật avatar
    UserResponse updateAvatar(Long userId, MultipartFile file);

    // Vô hiệu hóa user
    void deleteUser(Long userId);

    // Tạo user (ADMIN)
    UserResponse adminCreateUser(AdminUserCreationRequest request);

    // Cập nhật user (ADMIN)
    UserResponse adminUpdateUser(Long userId, AdminUpdateUserRequest request);

    // Cập nhật mật khẩu (ADMIN)
    void adminResetPassword(Long userId, String newPassword);

    // Tìm kiếm user (ADMIN)
    PageResponse<UserResponse> searchUsers(String keyword, Pageable pageable);

    // Bật/Tắt trạng thái user (ADMIN)
    void toggleUserActiveStatus(Long userId);
}
