package com.example.back_end.service.review;

import com.example.back_end.dto.request.review.ReviewRequest;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.dto.response.review.ReviewResponse;
import com.example.back_end.entity.Review;

import java.util.List;

public interface IReviewService {
    void addReview(ReviewRequest request);
    void editReview(ReviewRequest request);
    List<ReviewResponse> lisReviewResponseList(Long productId);
    PageResponse<ReviewResponse> getReviews(
            Integer rating,
            Boolean replied,
            int page,
            int size
    );
    void replyReview(Long reviewId, String adminReply);

}
