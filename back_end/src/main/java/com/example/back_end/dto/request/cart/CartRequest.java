package com.example.back_end.dto.request.cart;

import com.example.back_end.entity.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {
    Long idCartItem;
    boolean action;// lưu giá trị là trừ(F) hoặc cộng(T)
    int amount;
}
