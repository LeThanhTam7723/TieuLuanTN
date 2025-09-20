package com.example.back_end.service.cart;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.CartRequest;

import java.util.List;

public interface ICartService {
    void updateCartItem(CartRequest request);
    List<CartDetailDto>listCartDetail (Long idUser);
}
