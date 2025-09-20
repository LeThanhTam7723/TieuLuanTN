package com.example.back_end.dto.response;

import com.example.back_end.dto.response.user.UserResponse;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AuthenticationResponse {
    String token;
    boolean authenticated;
    UserResponse currentUser;
}
