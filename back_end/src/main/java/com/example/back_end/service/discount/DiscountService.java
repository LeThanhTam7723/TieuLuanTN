package com.example.back_end.service.discount;

import com.example.back_end.dto.request.discount.DiscountCreationRequest;
import com.example.back_end.dto.request.discount.DiscountUpdateRequest;
import com.example.back_end.dto.response.discount.DiscountResponse;
import com.example.back_end.entity.Discount;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repository.DiscountRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscountService implements IDiscountService {
    private final DiscountRepository discountRepository;
    private final ModelMapper modelMapper;

    @Override
    public Discount findByCode(String code) {
        return discountRepository.findByCode(code);
    }

    @Override
    public DiscountResponse createDiscount(DiscountCreationRequest request) {
        if (discountRepository.findByCode(request.getCode()) != null) {
            throw new AppException(ErrorCode.DISCOUNT_CODE_EXISTS);
        }

        Discount discount = Discount.builder()
                .code(request.getCode())
                .discountName(request.getDiscountName())
                .description(request.getDescription())
                .salePercent(request.getSalePercent())
                .build();

        Discount savedDiscount = discountRepository.save(discount);
        return modelMapper.map(savedDiscount, DiscountResponse.class);
    }

    @Override
    public DiscountResponse updateDiscount(Long id, DiscountUpdateRequest request) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));

        discount.setDiscountName(request.getDiscountName());
        discount.setDescription(request.getDescription());
        discount.setSalePercent(request.getSalePercent());

        Discount updatedDiscount = discountRepository.save(discount);
        return modelMapper.map(updatedDiscount, DiscountResponse.class);
    }

    @Override
    public void deleteDiscount(Long id) {
        if (!discountRepository.existsById(id)) {
            throw new AppException(ErrorCode.DISCOUNT_NOT_FOUND);
        }
        discountRepository.deleteById(id);
    }

    @Override
    public List<DiscountResponse> getAllDiscounts() {
        return discountRepository.findAll().stream()
                .map(discount -> modelMapper.map(discount, DiscountResponse.class))
                .collect(Collectors.toList());
    }

    @Override
    public DiscountResponse getDiscountById(Long id) {
        Discount discount = discountRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.DISCOUNT_NOT_FOUND));
        return modelMapper.map(discount, DiscountResponse.class);
    }
}
