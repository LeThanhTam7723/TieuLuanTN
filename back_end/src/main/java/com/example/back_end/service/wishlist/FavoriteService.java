package com.example.back_end.service.wishlist;

import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.entity.Favorite;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ProductMapper;
import com.example.back_end.repository.FavoriteRepository;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteService implements IFavoriteService {
    private final FavoriteRepository favoriteRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    @Override
    public ApiResponse<ProductResponse> addFavorite(Long userId, Long productId) {
        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (user == null || product == null) {
            return ApiResponse.<ProductResponse>builder()
                    .code(1)
                    .message("User hoặc Product không tồn tại.")
                    .build();
        } else {
            if (favoriteRepository.existsByIdUser_IdAndIdProduct_Id(userId, productId)) {
                return ApiResponse.<ProductResponse>builder()
                        .code(1)
                        .message("Sản phẩm đã được thêm vào yêu thích trước đó")
                        .build();
            }
        }
        Favorite favorite = new Favorite();
        favorite.setIdUser(user);
        favorite.setIdProduct(product);
        favoriteRepository.save(favorite);
        ProductResponse newOne = productMapper.toResponse(product);
        return ApiResponse.<ProductResponse>builder()
                .result(newOne)
                .message("Thêm thành công vào danh sách yêu thích.")
                .build();
    }

    @Override
    public ApiResponse<Void> removeFavoriteByUserIdAndProductId(Long userId, Long productId) {
        User user = userRepository.findUserById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        if (user == null || product == null) {
            return ApiResponse.<Void>builder()
                    .code(1)
                    .message("User hoặc Product không tồn tại.")
                    .build();
        }
        if (!favoriteRepository.existsByIdUser_IdAndIdProduct_Id(userId, productId)) {
            return ApiResponse.<Void>builder()
                    .code(1)
                    .message("Favorite không tồn tại.")
                    .build();
        }

        favoriteRepository.deleteByIdUser_IdAndIdProduct_Id(userId, productId);
        System.out.println("xóa");
        return ApiResponse.<Void>builder()
                .code(1)
                .message("Xóa thành công product khỏi danh sách yêu thích.")
                .build();
    }

    @Override
    public List<ProductResponse> getFavoritesByUserId(Long userId) {
        List<Favorite> favorites = favoriteRepository.findByIdUser_Id(userId);
        List<ProductResponse> result = new ArrayList<>();
        for (Favorite a : favorites) {
            Product product = productRepository.findById(a.getIdProduct().getId())
                    .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
            ProductResponse newOne = productMapper.toResponse(product);
            result.add(newOne);
        }
        return result;
    }

    @Override
    public boolean isFavorite(Long userId, Long productId) {
        return favoriteRepository.existsByIdUser_IdAndIdProduct_Id(userId, productId);
    }

}
