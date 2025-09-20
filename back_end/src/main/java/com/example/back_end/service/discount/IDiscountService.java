package com.example.back_end.service.discount;

import com.example.back_end.dto.request.discount.DiscountCreationRequest;
import com.example.back_end.dto.request.discount.DiscountUpdateRequest;
import com.example.back_end.dto.response.discount.DiscountResponse;
import com.example.back_end.entity.Discount;

import java.util.List;

public interface IDiscountService {
    Discount findByCode(String code);
    
    DiscountResponse createDiscount(DiscountCreationRequest request);
    
    DiscountResponse updateDiscount(Long id, DiscountUpdateRequest request);
    
    void deleteDiscount(Long id);
    
    List<DiscountResponse> getAllDiscounts();
    
    DiscountResponse getDiscountById(Long id);
}
