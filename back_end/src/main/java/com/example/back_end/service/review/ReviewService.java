package com.example.back_end.service.review;

import com.example.back_end.dto.request.review.ReviewRequest;
import com.example.back_end.dto.response.review.ReviewResponse;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.Review;
import com.example.back_end.mapper.ReviewMapper;
import com.example.back_end.repository.ReviewRepository;
import com.example.back_end.service.product.ProductService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ReviewService implements IReviewService{
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final ProductService productService;
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
}
