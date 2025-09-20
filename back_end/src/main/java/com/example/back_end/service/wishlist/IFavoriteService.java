package com.example.back_end.service.wishlist;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.product.ProductResponse;

import java.util.List;

public interface IFavoriteService {
    ApiResponse<ProductResponse> addFavorite(Long userId, Long productId);

    ApiResponse<Void> removeFavoriteByUserIdAndProductId(Long userId, Long productId);

    List<ProductResponse> getFavoritesByUserId(Long userId);

    boolean isFavorite(Long userId, Long productId);
}
