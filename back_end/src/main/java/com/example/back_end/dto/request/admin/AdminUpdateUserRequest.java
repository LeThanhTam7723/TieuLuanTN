package com.example.back_end.dto.request.admin;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminUpdateUserRequest {
    @NotBlank(message = "Username is required")
    @Size(min = 3, max =  50, message = "Username must be between 3 and 100 characters")
    private String username;

    @NotBlank(message = "Full name is required")
    @Size(max = 100, message = "Full name must be less than 100 characters")
    private String fullname;

    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format")
    private String phone;

    private Boolean active;

    private Set<String> roleNames;
}