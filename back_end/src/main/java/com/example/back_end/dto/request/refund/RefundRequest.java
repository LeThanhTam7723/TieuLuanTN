package com.example.back_end.dto.request.refund;

import com.example.back_end.constant.RefundStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RefundRequest {
    private Long orderDetailId;
    private String reason;
    private String description;
    private List<MultipartFile> images;
}
