package com.example.back_end.service.cart;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.cart.AddCartRequest;
import com.example.back_end.dto.request.cart.CartRequest;

import java.util.List;

public interface ICartService {
    void updateCartItem(CartRequest request);
    void addCartItem(AddCartRequest request);
    void deleteCartItem(Long idCartItem);
    List<CartDetailDto>listCartDetail (Long idUser);
}
