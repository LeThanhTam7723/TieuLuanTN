package com.example.back_end.controller;

import com.example.back_end.dto.request.review.ReviewRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.review.ReviewResponse;
import com.example.back_end.service.review.IReviewService;
import lombok.RequiredArgsConstructor;
import org.mapstruct.Mapping;
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
}
