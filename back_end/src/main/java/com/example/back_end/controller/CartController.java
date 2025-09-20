package com.example.back_end.controller;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.cart.CartDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartDetailService cartDetailService;
    @PostMapping("/updateItem")
    public ApiResponse<Void>updateCartItem(@RequestBody CartRequest request){
        cartDetailService.updateCartItem(request);
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping("/listCartItem/{userId}")
    public ApiResponse<List<CartDetailDto>>addCart(@PathVariable Long userId){
        List<CartDetailDto> res =cartDetailService.listCartDetail(userId);
        return ApiResponse.<List<CartDetailDto>>builder().result(res).build();
    }
}
