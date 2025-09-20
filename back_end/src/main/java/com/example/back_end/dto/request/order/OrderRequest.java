package com.example.back_end.dto.request.order;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.bind.annotation.RequestParam;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    Long orderId;
    int statusId;
}
