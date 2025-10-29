package com.example.back_end.controller;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.CartRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.user.UserResponse;
import com.example.back_end.entity.User;
import com.example.back_end.service.cart.CartDetailService;
import com.example.back_end.service.user.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/cart")
public class CartController {
    @Autowired
    private CartDetailService cartDetailService;
    @Autowired
    private  IUserService userService;
    @PostMapping("/updateItem")
    public ApiResponse<Void>updateCartItem(@RequestBody CartRequest request){
        cartDetailService.updateCartItem(request);
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping("/listCartItem")
    public ApiResponse<List<CartDetailDto>>addCart(){
        UserResponse userDto = userService.getCurrentUser();
        List<CartDetailDto> res =cartDetailService.listCartDetail(userDto.getId());
        return ApiResponse.<List<CartDetailDto>>builder().result(res).build();
    }
}
