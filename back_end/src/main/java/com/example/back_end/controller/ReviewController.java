package com.example.back_end.controller;

import com.example.back_end.dto.request.review.ReviewReplyRequest;
import com.example.back_end.dto.request.review.ReviewRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.AuthenticationResponse;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.dto.response.review.ReviewResponse;
import com.example.back_end.entity.Review;
import com.example.back_end.service.review.IReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/review")
@RequiredArgsConstructor
public class ReviewController {
    private final IReviewService iReviewService;
    @PostMapping("/add")
    ApiResponse<Void>addReview (@RequestBody ReviewRequest request){
        iReviewService.addReview(request);
        return ApiResponse.<Void>builder().build();
    }
    @PutMapping ("/update")
    ApiResponse<Void>updateReview (@RequestBody ReviewRequest request){
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping("/comments/{productId}")
    ApiResponse<List<ReviewResponse>> getList(@PathVariable Long productId){
        List<ReviewResponse> reviewResponses= iReviewService.lisReviewResponseList(productId);
        return ApiResponse.<List<ReviewResponse>>builder().result(reviewResponses).build();
    }
    @GetMapping("/admin")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN')")
    public PageResponse<ReviewResponse> getReviews(
            @RequestParam(required = false) Integer rating,
            @RequestParam(required = false) Boolean replied,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return iReviewService.getReviews(rating, replied, page, size);
    }

    @PutMapping("/admin/reply")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN')")
    public ApiResponse<Void> replyReview(
            @RequestBody @Valid ReviewReplyRequest request
    ) {
        iReviewService.replyReview(request.getReviewId(), request.getAdminReply());
        return ApiResponse.<Void>builder()
                .code(0)
                .message("Login successful")
                .build();
    }
}
