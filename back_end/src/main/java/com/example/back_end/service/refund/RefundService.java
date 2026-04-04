package com.example.back_end.service.refund;

import com.cloudinary.Cloudinary;
import com.example.back_end.constant.RefundStatus;
import com.example.back_end.dto.request.refund.RefundRequest;
import com.example.back_end.dto.response.refund.RefundResponse;
import com.example.back_end.entity.OrderDetail;
import com.example.back_end.entity.Refund;
import com.example.back_end.entity.RefundImage;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.RefundMapper;
import com.example.back_end.repository.OrderDetailRepository;
import com.example.back_end.repository.RefundRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
@Transactional
public class RefundService implements IRefundService{
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/gif");
    private final OrderDetailRepository orderDetailRepository;
    private final RefundMapper refundMapper;
    private final RefundRepository refundRepository;
    private final Cloudinary cloudinary;
    private void validateImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new AppException(ErrorCode.INVALID_KEY);
        }

        if (file.getSize() > MAX_IMAGE_SIZE) {
            throw new AppException(ErrorCode.IMAGE_SIZE_TOO_LARGE);
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType)) {
            throw new AppException(ErrorCode.INVALID_IMAGE_FORMAT);
        }
    }
    private String uploadToCloudinary(MultipartFile file) {
        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    Map.of(
                            "folder", "refunds",
                            "resource_type", "image"
                    )
            );

            return uploadResult.get("secure_url").toString();

        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }
    @Override
    public void requestRefund(RefundRequest request) {
        List<MultipartFile> files = request.getImages();
        if (files != null && files.size() > 5) {
            throw new AppException(ErrorCode.ONLY_FIVE_PICTURES);
        }
        OrderDetail orderDetail = orderDetailRepository.findById(request.getOrderDetailId())
                .orElseThrow(() -> new AppException(ErrorCode.ORDER_NOT_FOUND));

        if (orderDetail.getRefund() != null) {
            throw new AppException(ErrorCode.ORDER_REFUND_EXISTED);
        }
        Refund refund = refundMapper.toEntity(request);
        if (files != null && !files.isEmpty()) {

            for (MultipartFile file : files) {
                validateImage(file);

                String imageUrl = uploadToCloudinary(file);

                RefundImage image = new RefundImage();
                image.setImageUrl(imageUrl);
                image.setRefund(refund);

                refund.getImages().add(image);
            }
        }
        refundRepository.save(refund);
        orderDetail.setRefund(refund);
    }

    @Override
    public void approveRefund(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund không tồn tại"));

        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new RuntimeException("Refund không ở trạng thái REQUESTED");
        }
        refund.setStatus(RefundStatus.REFUNDED);

    }

    @Override
    public void rejectRefund(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund không tồn tại"));

        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new RuntimeException("Refund không ở trạng thái REQUESTED");
        }
        refund.setStatus(RefundStatus.REJECTED);

    }

    @Override
    public void refundedRefund(Long refundId) {
        Refund refund = refundRepository.findById(refundId)
                .orElseThrow(() -> new RuntimeException("Refund không tồn tại"));

        if (refund.getStatus() != RefundStatus.REQUESTED) {
            throw new RuntimeException("Refund không ở trạng thái REQUESTED");
        }

        refund.setStatus(RefundStatus.REFUNDED);

    }

}
