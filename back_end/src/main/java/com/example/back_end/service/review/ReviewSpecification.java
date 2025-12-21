package com.example.back_end.service.review;

import com.example.back_end.entity.Review;
import org.springframework.data.jpa.domain.Specification;

public class ReviewSpecification {

    public static Specification<Review> hasRating(Integer rating) {
        return (root, query, cb) ->
                rating == null ? null : cb.equal(root.get("rating"), rating);
    }

    public static Specification<Review> isReplied(Boolean replied) {
        return (root, query, cb) -> {
            if (replied == null) return null;
            return replied
                    ? cb.isNotNull(root.get("replyContent"))
                    : cb.isNull(root.get("replyContent"));
        };
    }
}