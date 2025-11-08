package com.example.back_end.controller;

import com.example.back_end.dto.CartDetailDto;
import com.example.back_end.dto.request.cart.AddCartRequest;
import com.example.back_end.dto.request.cart.CartRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.user.UserResponse;
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
    @PutMapping("/updateItem")
    public ApiResponse<Void>updateCartItem(@RequestBody CartRequest request){
        cartDetailService.updateCartItem(request);
        return ApiResponse.<Void>builder().build();
    }
    @PostMapping("/addCart")
    public ApiResponse<Void>addCart(@RequestBody AddCartRequest request){
        cartDetailService.addCartItem(request);
        return ApiResponse.<Void>builder().build();
    }
    @DeleteMapping("/deleteItem/{id}")
    public ApiResponse<Void>deleteCartItem(@PathVariable Long id){
        cartDetailService.deleteCartItem(id);
        return ApiResponse.<Void>builder().build();
    }
    @GetMapping("/listCartItem")
    public ApiResponse<List<CartDetailDto>>addCart(){
        UserResponse userDto = userService.getCurrentUser();
        List<CartDetailDto> res =cartDetailService.listCartDetail(userDto.getId());
        return ApiResponse.<List<CartDetailDto>>builder().result(res).build();
    }
}
