package com.example.back_end.service.cart;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.entity.Cart;
import com.example.back_end.entity.CartDetail;
import com.example.back_end.entity.ProductVariant;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
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
    @Override
    public void updateCartItem(CartRequest request) {
        Cart cart = cartRepository.findByUser_IdAndIsOrdered(request.getIdUser(), false)
                .orElseGet(() -> {
                    Cart newOne = new Cart();
                    newOne.setUser(userService.getUserById(request.getIdUser()));
                    newOne.setOrdered(false);
                    cartRepository.save(newOne);
                    return newOne;
                });
//        ProductVariant product = productService.getById(request.getIdProduct());
        ProductVariant product = variantRepository.findById(request.getIdProduct())
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        System.out.println(product.getId());
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
    public List<CartDetailDto> listCartDetail(Long idUser) {
        List<CartDetail> list = new ArrayList<>();
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
        }
        return list.stream()
                .map(cartDetail -> modelMapper.map(cartDetail, CartDetailDto.class))
                .collect(Collectors.toList());
    }
}
