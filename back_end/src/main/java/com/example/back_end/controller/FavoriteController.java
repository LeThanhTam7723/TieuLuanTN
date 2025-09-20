package com.example.back_end.controller;

import com.example.back_end.dto.request.FavoriteRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.service.wishlist.FavoriteService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@RequestMapping("/favorite")
public class FavoriteController {
    private final FavoriteService favoriteService;

    @PostMapping("/add")
    public ApiResponse<ProductResponse> addFavorite(@RequestBody FavoriteRequest request) {
        return favoriteService.addFavorite(request.getUserId(), request.getProductId());
    }

    @DeleteMapping("/delete")
    public ApiResponse<Void> deleteFavorite(@RequestBody FavoriteRequest request) {
        return favoriteService.removeFavoriteByUserIdAndProductId(request.getUserId(), request.getProductId());
    }

    @GetMapping("/idUser/{userId}")
    public ApiResponse<List<ProductResponse>> getFavoritesByUserId(@PathVariable Long userId) {
        return ApiResponse.<List<ProductResponse>>builder().result(favoriteService.getFavoritesByUserId(userId)).build();
    }

    @GetMapping("/check")
    public ResponseEntity<Boolean> checkFavorite(@RequestParam Long userId, @RequestParam Long productId) {
        return ResponseEntity.ok(favoriteService.isFavorite(userId, productId));
    }
}
