package com.example.back_end.config;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;

import javax.crypto.spec.SecretKeySpec;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    // Xác thực yêu cầu
    private final String[] PUBLIC_ENDPOINTS_POST = {"users/createUser",
            "auth/login", "auth/introspect", "/verifyRegister", "auth/register", "users/existUser", "/products/**",
            "/categories/**", "/users/**","/forgotPassword"};
    private final String[] PUBLIC_ENDPOINTS_GET = {"cart/listCartItem/**", "favorite/idUser/**","/order/**"};
    private final String[] PUBLIC_ENDPOINTS_GET_PERMITALL = {"/users/**", "/categories/**", "/products/**",
            "/auth/verifyAccount", "/discount/getDiscount", "/genders/**", "/colors/**", "/sizes/**", "brands/**","/payment/vnpay/**","/review/comments/**"};
    private final String[] PUBLIC_ENDPOINTS_PUT = {"/users/**", "/categories/**", "/products/**","/order/update"};
    private final String[] PUBLIC_ENDPOINTS_PATCH = {"/users/**", "/categories/**", "/products/**"};
    private final String[] PUBLIC_ENDPOINTS_DELETE = {"/users/**", "/categories/**", "/products/**", "/favorite/delete"};
    private final String[] PUBLIC_ENDPOINTS_LOGIN = {"/logout", "/cart/updateItem", "/order/add", "/favorite/add","/review/**"};

    @Value("${jwt.signer-key}")
    protected String SIGNER_KEY;
    @Autowired
    private ObjectMapper objectMapper;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .cors(cors -> cors
                        .configurationSource(request -> {
                            var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                            corsConfiguration.setAllowedOrigins(List.of("http://localhost:5173"));
                            corsConfiguration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
                            corsConfiguration.setAllowedHeaders(List.of("*"));
                            corsConfiguration.setAllowCredentials(true);
                            return corsConfiguration;
                        }))
                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_POST).permitAll()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET_PERMITALL).permitAll()
                        .requestMatchers(HttpMethod.PUT, PUBLIC_ENDPOINTS_PUT).authenticated()
                        .requestMatchers(HttpMethod.PATCH, PUBLIC_ENDPOINTS_PATCH).authenticated()
                        .requestMatchers(HttpMethod.DELETE, PUBLIC_ENDPOINTS_DELETE).authenticated()
                        .requestMatchers(HttpMethod.GET, PUBLIC_ENDPOINTS_GET).authenticated()
                        .requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS_LOGIN).authenticated()
                        .anyRequest().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())))
                .exceptionHandling(exception -> exception
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                            response.setContentType("application/json");
                            response.getWriter().write(objectMapper.writeValueAsString(
                                    ApiResponse.builder()
                                            .code(ErrorCode.UNAUTHENTICATED.getCode())
                                            .message(ErrorCode.UNAUTHENTICATED.getMessage())
                                            .build()));
                        }))
                .csrf(AbstractHttpConfigurer::disable);

        return httpSecurity.build();
    }

    @Bean
    JwtDecoder jwtDecoder() {
        SecretKeySpec secretKeySpec = new SecretKeySpec(SIGNER_KEY.getBytes(), "HS512");
        return NimbusJwtDecoder
                .withSecretKey(secretKeySpec)
                .macAlgorithm(MacAlgorithm.HS512)
                .build();
    }

}
