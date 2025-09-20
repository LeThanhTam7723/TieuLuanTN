package com.example.back_end.dto.request;

import com.example.back_end.entity.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartRequest {
    Long idUser;
    Long idProduct;
    boolean action;// lưu giá trị là trừ(F) hoặc cộng(T)
    int amount;
}
