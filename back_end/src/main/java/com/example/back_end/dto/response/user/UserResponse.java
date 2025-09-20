package com.example.back_end.dto.response.user;

import com.example.back_end.entity.Role;
import lombok.*;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String username;
    private String email;
    private String fullname;
    private String phone;
    private Boolean active = false;
    private String imageUrl;
    private Set<Role> roles;
}
