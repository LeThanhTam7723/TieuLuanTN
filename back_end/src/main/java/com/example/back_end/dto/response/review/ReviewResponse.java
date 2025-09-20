package com.example.back_end.dto.response.review;

import com.example.back_end.dto.response.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    UserResponse userResponse;
    private int rating;
    private String comment;
    private LocalDateTime createdAt;
}
