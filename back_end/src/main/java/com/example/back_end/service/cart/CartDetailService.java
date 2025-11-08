package com.example.back_end.service.cart;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.cart.AddCartRequest;
import com.example.back_end.dto.request.cart.CartRequest;
import com.example.back_end.dto.response.product.ProductImageSummary;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.entity.*;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.CartMapper;
import com.example.back_end.repository.CartDetailRepository;
import com.example.back_end.repository.CartRepository;
import com.example.back_end.repository.ProductVariantRepository;
import com.example.back_end.service.product.IProductVariantService;
import com.example.back_end.service.user.IUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class CartDetailService implements ICartService{
    private final CartRepository cartRepository;
    private final CartDetailRepository cartDetailRepository;
    private final IUserService userService;
    private final IProductVariantService productService;
    private final ModelMapper modelMapper;
    private final ProductVariantRepository variantRepository;
    private final CartMapper cartMapper;

    @Override
    public void updateCartItem(CartRequest request) {
        UserResponse currentUser = userService.getCurrentUser();
//        Cart cart = cartRepository.findByUser_IdAndIsOrdered(currentUser.getId(), false)
//                .orElseGet(() -> {
//                    Cart newOne = new Cart();
//                    newOne.setUser(userService.getUserById(currentUser.getId()));
//                    newOne.setOrdered(false);
//                    cartRepository.save(newOne);
//                    return newOne;
//                });
//        ProductVariant product = productService.getById(request.getIdProduct());
//        ProductVariant product = variantRepository.findById(request.getIdProduct())
//                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
//        System.out.println(product.getId());
        CartDetail cartDetail = cartDetailRepository.findById(request.getIdCartItem())
                .orElseThrow(() -> new AppException(ErrorCode.CART_ITEM_NOT_EXISTED));
        System.out.println(cartDetail.getIdProduct().getId());
        if (cartDetail.getId() != null) {
            if(request.isAction()){
                cartDetail.setQuantity(cartDetail.getQuantity()+ request.getAmount());
                System.out.println("cộng");
            } else {
                cartDetail.setQuantity(cartDetail.getQuantity()- request.getAmount());
                System.out.println("trừ");
            }
            cartDetailRepository.save(cartDetail);
        }
    }

    @Override
    public void addCartItem(AddCartRequest request) {
        UserResponse currentUser = userService.getCurrentUser();
        Cart cart = cartRepository.findByUser_IdAndIsOrdered(currentUser.getId(), false)
                .orElseGet(() -> {
                    Cart newOne = new Cart();
                    newOne.setUser(userService.getUserById(currentUser.getId()));
                    newOne.setOrdered(false);
                    cartRepository.save(newOne);
                    return newOne;
                });
        ProductVariant product = variantRepository.findById(request.getIdProduct())
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        CartDetail cartDetail = cartDetailRepository.findByIdCartAndIdProduct_Id(cart, product.getId())
                .orElseGet(() -> {
                    System.out.println("Ko tìm thấy");
                    CartDetail newCartDetail = new CartDetail();
                    newCartDetail.setIdCart(cart);
                    newCartDetail.setIdProduct(product);
                    newCartDetail.setQuantity(0);
                    cartDetailRepository.save(newCartDetail);
                    return newCartDetail;
                });
        cartDetail.setQuantity(cartDetail.getQuantity()+ request.getAmount());

        cartDetailRepository.save(cartDetail);
    }

    @Override
    public void deleteCartItem(Long idCartItem) {
        cartDetailRepository.deleteById(idCartItem);
    }

    @Override
    public List<CartDetailDto> listCartDetail(Long idUser) {
        List<CartDetail> list = new ArrayList<>();
        List<CartDetailDto> listDto = new ArrayList<>();
        Cart cart = cartRepository.findByUser_IdAndIsOrdered(idUser, false)
                .orElseGet(() -> {
                    Cart newOne = new Cart();
                    newOne.setUser(userService.getUserById(idUser));
                    newOne.setOrdered(false);
                    cartRepository.save(newOne);
                    return newOne;
                });
        if(cart.getId() != null){
            list = cartDetailRepository.findAllByIdCart(cart);
            list.forEach(d -> {
                System.out.println("Images: " + d.getIdProduct().getProduct().getImages().size());
                d.getIdProduct().getProduct().getImages().stream()
                        .filter(ProductImage::isPrimary) // hoặc img -> img.isPrimary() nếu không có getter
                        .forEach(img -> System.out.println("Primary Image URL: " + img.getImageUrl()));
            });
        }
//        listDto = list.stream()
//                .map(cartDetail -> modelMapper.map(cartDetail, CartDetailDto.class))
//                .collect(Collectors.toList());
        listDto = list.stream()
                .map(cartDetail -> {
                    ProductVariantResponse variantResponse = modelMapper.map(cartDetail.getIdProduct(), ProductVariantResponse.class);

                    // Lấy ảnh chính
                    Product product = cartDetail.getIdProduct().getProduct();
                    if (product != null && product.getImages() != null) {
                        product.getImages().stream()
                                .filter(ProductImage::isPrimary)
                                .findFirst()
                                .ifPresent(primaryImage -> {
                                    ProductSummary productSummary = variantResponse.getProduct();
                                    if (productSummary != null) {
                                        productSummary.setPrimaryImage(
                                                modelMapper.map(primaryImage, ProductImageSummary.class)
                                        );
                                    }
                                });
                    }

                    CartDetailDto dto = new CartDetailDto();
                    dto.setId(cartDetail.getId());
                    dto.setQuantity(cartDetail.getQuantity());
                    dto.setProduct(variantResponse);
                    return dto;
                })
                .collect(Collectors.toList());
        return listDto;
    }
}
