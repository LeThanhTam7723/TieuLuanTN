package com.example.back_end.dto.request.review;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private Long idProduct;
    private Long idUser;
    private int rating; // 1 đến 5 sao
    private String comment;
}
