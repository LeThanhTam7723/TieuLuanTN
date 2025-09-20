package com.example.back_end.controller;

import com.example.back_end.dto.request.IntrospectRequest;
import com.example.back_end.dto.request.LoginRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.IntrospectResponse;
import com.example.back_end.service.AuthService;
import com.example.back_end.service.user.IUserService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import com.example.back_end.service.SendEmailService;
import com.nimbusds.jose.JOSEException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.text.ParseException;

@Slf4j
@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173"})
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private AuthService authService;
    @Autowired
    private IUserService userService;
    @Autowired
    SendEmailService sendEmailService;

    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> login(@RequestBody LoginRequest request) {
        AuthenticationResponse response = authService.login(request);
        return ApiResponse.<AuthenticationResponse>builder()
                .code(0)
                .message("Login successful")
                .result(response)
                .build();
    }

    @PostMapping("/introspect")
    public ApiResponse<IntrospectResponse> introspect(@RequestBody IntrospectRequest request) {
        try {
            IntrospectResponse response = authService.introspect(request);
            return ApiResponse.<IntrospectResponse>builder()
                    .code(0)
                    .message("Token introspection successful")
                    .result(response)
                    .build();
        } catch (Exception e) {
            log.error("Token introspection failed", e);
            return ApiResponse.<IntrospectResponse>builder()
                    .code(1)
                    .message("Token introspection failed: " + e.getMessage())
                    .build();
        }
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody IntrospectRequest request) {
        try {
            authService.logout(request);
            return ApiResponse.<Void>builder()
                    .code(0)
                    .message("Logout successful")
                    .build();
        } catch (Exception e) {
            log.error("Logout failed", e);
            return ApiResponse.<Void>builder()
                    .code(1)
                    .message("Logout failed: " + e.getMessage())
                    .build();
        }
    }

    @GetMapping("/verifyAccount")
    ApiResponse<Void> verifyAccount(@RequestParam("token") String token, HttpServletResponse response) throws ParseException, JOSEException, IOException {
        IntrospectRequest request = new IntrospectRequest(token);
        var result = authService.introspect(request);
        String email = result.getEmail();
        if (result.isValid()) {
            response.sendRedirect("http://localhost:5173/auth/register?email=" + email);
        } else {
            System.out.println("invalid-verification");
        }
        return ApiResponse.<Void>builder().build();
    }
}