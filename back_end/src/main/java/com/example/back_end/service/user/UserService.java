package com.example.back_end.service.user;

import com.example.back_end.constant.PredefinedRole;
import com.example.back_end.dto.request.admin.AdminUpdateUserRequest;
import com.example.back_end.dto.request.admin.AdminUserCreationRequest;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.user.UserCreationRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.entity.Role;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.UserMapper;
import com.example.back_end.repository.RoleRepository;
import com.example.back_end.repository.UserRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.dto.request.user.ChangePasswordRequest;
import com.example.back_end.dto.request.user.UpdateUserProfileRequest;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

    @Value("${jwt.signer-key}")
    private String SIGNER_KEY;

    @Autowired
    private Cloudinary cloudinary;

    @Override
    public User createRequest(UserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED);
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Role role = roleRepository.findByName(PredefinedRole.USER_ROLE)
                .orElseGet(() -> roleRepository.save(
                        Role.builder()
                                .name(PredefinedRole.USER_ROLE)
                                .description("User role")
                                .build()
                ));
        user.setRoles(new HashSet<>(List.of(role)));

        return userRepository.save(user);
    }

    @Override
    public IntrospectResponse introspect(IntrospectRequest request) throws Exception {
        String token = request.getToken();
        SignedJWT signedJWT = SignedJWT.parse(token);
        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
        
        boolean valid = signedJWT.verify(verifier) 
                && signedJWT.getJWTClaimsSet().getExpirationTime().after(new Date());
        
        return IntrospectResponse.builder()
                .valid(valid)
                .build();
    }

    @Override
    public PageResponse<UserResponse> getAllUsers(Pageable pageable) {
        log.info("Fetching users with pagination");
        Page<User> userPage = userRepository.findAll(pageable);
        List<UserResponse> userDtos = userMapper.toResponseList(userPage.getContent());
        
        return PageResponse.<UserResponse>builder()
                .content(userDtos)
                .pageNo(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Override
    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
    }

    @Override
    public AuthenticationResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }

        String token = generateToken(user);
        return AuthenticationResponse.builder()
                .token(token)
                .authenticated(true)
                .build();
    }

    @Override
    public List<UserResponse> getConvertedUsers(List<User> users) {
        return userMapper.toResponseList(users);
    }

    private String generateToken(User user) {
        JWTClaimsSet claims = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("CDWED.com")
                .issueTime(new Date())
                .expirationTime(Date.from(
                        Instant.now().plus(1, ChronoUnit.HOURS)
                ))
                .claim("scope", buildScope(user))
                .build();

        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
        JWSObject jws = new JWSObject(header, new Payload(claims.toJSONObject()));

        try {
            jws.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jws.serialize();
        } catch (JOSEException e) {
            log.error("Token signing error", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    private String buildScope(User user) {
        StringJoiner joiner = new StringJoiner(" ");
        if (!CollectionUtils.isEmpty(user.getRoles())) {
            user.getRoles().forEach(role -> joiner.add(role.getName()));
        }
        return joiner.toString();
    }

    @Override
    public UserResponse getCurrentUser() {
        String email = SecurityContextHolder.getContext()
                .getAuthentication().getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        return userMapper.toResponse(user);
    }

    @Override
    public UserResponse updateProfile(Long userId, UpdateUserProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra xem số điện thoại mới có bị trùng không
        if (!user.getPhone().equals(request.getPhone()) &&
            userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Số điện thoại đã được sử dụng");
        }

        user.setFullname(request.getFullname());
        user.setPhone(request.getPhone());

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    public ApiResponse<Void> changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Kiểm tra mật khẩu hiện tại
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_PASSWORD);
        }

        // Kiểm tra mật khẩu mới và xác nhận mật khẩu
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mật khẩu xác nhận không khớp");
        }

        // Kiểm tra mật khẩu mới không được trùng với mật khẩu cũ
        if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
            throw new AppException(ErrorCode.INVALID_REQUEST, "Mật khẩu mới không được trùng với mật khẩu cũ");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.<Void>builder()
                .code(0)
                .message("Đổi mật khẩu thành công")
                .build();
    }

    @Override
    public UserResponse updateAvatar(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        try {
            // Upload ảnh lên Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                    "folder", "user_avatars",
                    "resource_type", "image"
                )
            );

            // Xóa ảnh cũ nếu có
            if (user.getImageUrl() != null) {
                String publicId = user.getImageUrl().split("/")[user.getImageUrl().split("/").length - 1].split("\\.")[0];
                cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            }

            // Cập nhật URL ảnh mới
            user.setImageUrl((String) uploadResult.get("secure_url"));
            User updatedUser = userRepository.save(user);
            return userMapper.toResponse(updatedUser);

        } catch (IOException e) {
            log.error("Failed to upload avatar", e);
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        user.setActive(false); // Đặt trạng thái active là false
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')") // Chỉ admin mới được tạo người dùng với quyền này
    public UserResponse adminCreateUser(AdminUserCreationRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new AppException(ErrorCode.USER_EXISTED, "Tên đăng nhập đã tồn tại.");
        }
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException(ErrorCode.USER_EXISTED, "Email đã tồn tại.");
        }
        if (userRepository.existsByPhone(request.getPhone())) {
            throw new AppException(ErrorCode.USER_EXISTED, "Số điện thoại đã tồn tại.");
        }

        User user = userMapper.toEntity(request);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setActive(request.getActive() != null ? request.getActive() : true); // Đặt trạng thái active

        Set<Role> roles = new HashSet<>();
        if (request.getRoleNames() != null && !request.getRoleNames().isEmpty()) {
            request.getRoleNames().forEach(roleName -> {
                Role role = roleRepository.findByName(roleName)
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED)); // Cần tạo ErrorCode.ROLE_NOT_EXISTED nếu chưa có
                roles.add(role);
            });
        } else {
            // Nếu admin không chỉ định vai trò, mặc định gán USER_ROLE
            Role userRole = roleRepository.findByName(PredefinedRole.USER_ROLE)
                    .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
            roles.add(userRole);
        }
        user.setRoles(roles);

        return userMapper.toResponse(userRepository.save(user));
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public UserResponse adminUpdateUser(Long userId, AdminUpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Cập nhật username (nếu có và khác)
        if (request.getUsername() != null && !request.getUsername().isEmpty() && !user.getUsername().equals(request.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new AppException(ErrorCode.USER_EXISTED, "Tên đăng nhập đã tồn tại.");
            }
            user.setUsername(request.getUsername());
        }

        // Cập nhật fullname
        if (request.getFullname() != null && !request.getFullname().isEmpty()) {
            user.setFullname(request.getFullname());
        }

        // Cập nhật email (nếu có và khác)
        if (request.getEmail() != null && !request.getEmail().isEmpty() && !user.getEmail().equals(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new AppException(ErrorCode.USER_EXISTED, "Email đã tồn tại.");
            }
            user.setEmail(request.getEmail());
        }

        // Cập nhật phone (nếu có và khác)
        if (request.getPhone() != null && !request.getPhone().isEmpty() && !user.getPhone().equals(request.getPhone())) {
            if (userRepository.existsByPhone(request.getPhone())) {
                throw new AppException(ErrorCode.USER_EXISTED, "Số điện thoại đã tồn tại.");
            }
            user.setPhone(request.getPhone());
        }

        // Cập nhật trạng thái active
        if (request.getActive() != null) {
            user.setActive(request.getActive());
        }

        // Cập nhật vai trò (quan trọng cho admin)
        if (request.getRoleNames() != null) { // Kiểm tra null để admin có thể gửi request mà không thay đổi roles
            Set<Role> newRoles = new HashSet<>();
            if (!request.getRoleNames().isEmpty()) {
                request.getRoleNames().forEach(roleName -> {
                    Role role = roleRepository.findByName(roleName)
                            .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
                    newRoles.add(role);
                });
            } else {
                // Nếu admin gửi một danh sách rỗng, có thể hiểu là gỡ bỏ tất cả roles,
                // hoặc bạn có thể mặc định gán USER_ROLE nếu không có vai trò nào được chỉ định.
                // Tùy thuộc vào business logic của bạn. Ví dụ:
                Role userRole = roleRepository.findByName(PredefinedRole.USER_ROLE)
                        .orElseThrow(() -> new AppException(ErrorCode.ROLE_NOT_EXISTED));
                newRoles.add(userRole);
                log.warn("Admin attempted to set empty roles for user {}. Defaulting to USER_ROLE.", userId);
            }
            user.setRoles(newRoles);
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')") // Chỉ admin mới được phép đặt lại mật khẩu
    public void adminResetPassword(Long userId, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Override
    @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public PageResponse<UserResponse> searchUsers(String keyword, Pageable pageable) {
        // Kiểm tra keyword rỗng để tránh truy vấn không cần thiết
        if (keyword == null || keyword.trim().isEmpty()) {
            // Nếu keyword rỗng, có thể trả về tất cả người dùng
            return getAllUsers(pageable);
        }

        Page<User> userPage = userRepository.findByKeyword(keyword, pageable);

        List<UserResponse> userResponses = userPage.getContent().stream()
                .map(userMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<UserResponse>builder()
                .content(userResponses)
                .pageNo(userPage.getNumber())
                .pageSize(userPage.getSize())
                .totalElements(userPage.getTotalElements())
                .totalPages(userPage.getTotalPages())
                .last(userPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public void toggleUserActiveStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Đảo ngược trạng thái active
        user.setActive(!user.getActive());
        userRepository.save(user); // Lưu lại thay đổi
    }
}
