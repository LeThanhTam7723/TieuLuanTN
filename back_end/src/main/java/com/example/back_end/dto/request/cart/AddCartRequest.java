package com.example.back_end.dto.request.cart;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddCartRequest {
    Long idProduct;
    boolean action;// lưu giá trị là trừ(F) hoặc cộng(T)
    int amount;
}
