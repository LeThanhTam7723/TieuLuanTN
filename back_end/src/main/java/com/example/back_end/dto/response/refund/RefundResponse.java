package com.example.back_end.dto.response.refund;

import com.example.back_end.constant.RefundStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundResponse {
    private Long id;
    private String reason;
    private RefundStatus status;
    private List<String> imageUrls;
}
