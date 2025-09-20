package com.example.back_end.dto.request.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateUserProfileRequest {
    @NotBlank(message = "Họ tên không được để trống")
    @Size(min = 2, max = 100, message = "Họ tên phải từ 2 đến 100 ký tự")
    @Pattern(regexp = "^[\\p{L} .'-]+$", message = "Họ tên chỉ được chứa chữ cái, dấu cách và dấu gạch ngang")
    private String fullname;

    @NotBlank(message = "Số điện thoại không được để trống")
    @Pattern(regexp = "^(84|0[3|5|7|8|9])+([0-9]{8})$", message = "Số điện thoại không hợp lệ. Ví dụ: 0912345678 hoặc 84123456789")
    private String phone;
} 