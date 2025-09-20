package com.example.back_end.service.product;

import com.example.back_end.dto.request.product.ProductVariantCreationRequest;
import com.example.back_end.dto.request.product.ProductVariantUpdateRequest;
import com.example.back_end.dto.request.product.VariantFilterRequest;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.product.ProductVariantSummary;
import com.example.back_end.entity.*;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ProductVariantMapper;
import com.example.back_end.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductVariantService implements IProductVariantService {
    private final ProductVariantRepository variantRepository;
    private final ProductRepository productRepository;
    private final ColorRepository colorRepository;
    private final SizeRepository sizeRepository;
    private final ProductVariantMapper variantMapper;

    @Override
    @Transactional
    public ProductVariantResponse createVariant(Long productId, ProductVariantCreationRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));

        if (variantRepository.existsByProductIdAndColorIdAndSizeId(productId, request.getColorId(), request.getSizeId())) {
            throw new AppException(ErrorCode.VARIANT_EXISTS);
        }

        ProductVariant variant = variantMapper.toEntity(request);
        variant.setProduct(product);
        variant.setColor(color);
        variant.setSize(size);
        variant.setActive(true);

        return variantMapper.toResponse(variantRepository.save(variant));
    }

    @Override
    @Transactional
    public ProductVariantResponse updateVariant(Long id, ProductVariantUpdateRequest request) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));

        Color color = colorRepository.findById(request.getColorId())
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));

        Size size = sizeRepository.findById(request.getSizeId())
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));

        if (!variant.getColor().getId().equals(request.getColorId()) ||
            !variant.getSize().getId().equals(request.getSizeId())) {
            if (variantRepository.existsByProductIdAndColorIdAndSizeId(
                    variant.getProduct().getId(), request.getColorId(), request.getSizeId())) {
                throw new AppException(ErrorCode.VARIANT_EXISTS);
            }
        }

        variantMapper.updateVariantFromRequest(request, variant);
        variant.setColor(color);
        variant.setSize(size);

        return variantMapper.toResponse(variantRepository.save(variant));
    }

    @Override
    @Transactional
    public void deleteVariant(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        variant.setActive(false);
        variantRepository.save(variant);
    }

    @Override
    public ProductVariantResponse getVariantById(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        return variantMapper.toResponse(variant);
    }

    @Override
    public List<ProductVariantSummary> getVariantsByProduct(Long productId) {
        return variantMapper.toSummaryList(variantRepository.findByProductIdAndActiveTrue(productId));
    }

    @Override
    @Transactional
    public void toggleVariantStatus(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        variant.setActive(!variant.isActive());
        variantRepository.save(variant);
    }

    @Override
    public boolean existsByProductAndColorAndSize(Long productId, Long colorId, Long sizeId) {
        return variantRepository.existsByProductIdAndColorIdAndSizeId(productId, colorId, sizeId);
    }

    @Override
    public ProductVariantResponse getVariantBySku(String sku) {
        ProductVariant variant = variantRepository.findBySkuAndActiveTrue(sku)
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        return variantMapper.toResponse(variant);
    }

    @Override
    public List<ProductVariantSummary> filterVariants(Long productId, VariantFilterRequest filter) {
        List<ProductVariant> variants = variantRepository.findByProductIdAndActiveTrue(productId);
        
        return variants.stream()
                .filter(variant -> filter.getColorId() == null || 
                        variant.getColor().getId().equals(filter.getColorId()))
                .filter(variant -> filter.getSizeId() == null || 
                        variant.getSize().getId().equals(filter.getSizeId()))
                .filter(variant -> filter.getActive() == null || 
                        variant.isActive() == filter.getActive())
                .map(variantMapper::toSummary)
                .toList();
    }

    @Override
    public ProductVariant getById(Long id) {
        ProductVariant variant = variantRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));
        return variant;
    }
} 