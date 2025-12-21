package com.example.back_end.service.review;

import com.example.back_end.dto.request.review.ReviewRequest;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.dto.response.review.ReviewResponse;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.Review;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ReviewMapper;
import com.example.back_end.repository.ReviewRepository;
import com.example.back_end.service.product.ProductService;
import com.example.back_end.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewService implements IReviewService{
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final ProductService productService;
    private final IUserService userService;
    @Override
    public void addReview(ReviewRequest request) {
        Review a = reviewMapper.toEntity(request);
        reviewRepository.save(a);
    }

    @Override
    public void editReview(ReviewRequest request) {

    }

    @Override
    public List<ReviewResponse> lisReviewResponseList(Long productId) {
        Product a = productService.getProductById(productId);
        List<Review> reviews = reviewRepository.findByIdProduct_Product(a);
        return reviews.stream().map(reviewMapper::toResponse).collect(Collectors.toList());
    }

    @Override
    public PageResponse<ReviewResponse> getReviews(Integer rating, Boolean replied, int page, int size) {
        Specification<Review> spec = Specification
                .where(ReviewSpecification.hasRating(rating))
                .and(ReviewSpecification.isReplied(replied));

        Pageable pageable = PageRequest.of(
                page,
                size,
                Sort.by(Sort.Direction.DESC, "createdAt")
        );

        Page<Review> reviewPage = reviewRepository.findAll(spec, pageable);

        return PageResponse.<ReviewResponse>builder()
                .content(
                        reviewPage.getContent()
                                .stream()
                                .map(reviewMapper::toResponse)
                                .toList()
                )
                .pageNo(reviewPage.getNumber())
                .pageSize(reviewPage.getSize())
                .totalElements(reviewPage.getTotalElements())
                .totalPages(reviewPage.getTotalPages())
                .last(reviewPage.isLast())
                .build();
    }

    @Override
    public void replyReview(Long reviewId, String adminReply) {
        UserResponse userResponse = userService.getCurrentUser();
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new AppException(ErrorCode.REVIEW_NOT_EXISTED));

        review.setAdminReply(adminReply);
        review.setRepliedAt(LocalDateTime.now());
        review.setRepliedBy(userService.getUserById(userResponse.getId()));

        reviewRepository.save(review);
    }
}
