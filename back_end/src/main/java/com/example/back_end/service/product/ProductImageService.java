package com.example.back_end.service.product;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.back_end.dto.request.product.ProductImageCreationRequest;
import com.example.back_end.dto.request.product.ProductImageUpdateRequest;
import com.example.back_end.dto.response.product.ProductImageResponse;
import com.example.back_end.dto.response.product.ProductImageSummary;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.ProductImage;
import com.example.back_end.entity.ProductVariant;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ProductImageMapper;
import com.example.back_end.repository.ProductImageRepository;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.ProductVariantRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductImageService implements IProductImageService {
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/gif");

    private final ProductImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final ProductVariantRepository variantRepository;
    private final ProductImageMapper imageMapper;
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

    @Override
    @Transactional
    public ProductImageResponse createImage(Long productId, Long variantId, boolean isActive, boolean isPrimary, ProductImageCreationRequest request) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        // Fetch variant if provided
        ProductVariant variant = null;
        if (variantId != null) {
            variant = variantRepository.findById(variantId)
                    .orElseThrow(() -> new AppException(ErrorCode.VARIANT_NOT_FOUND));

            // Optional: Validate variant belongs to the product
            if (!variant.getProduct().getId().equals(productId)) {
                throw new AppException(ErrorCode.VARIANT_NOT_FOUND);
            }
        }

        validateImage(request.getImageFile());

        try {
            // Upload image to Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    request.getImageFile().getBytes(),
                    ObjectUtils.asMap(
                            "folder", "products/" + productId,
                            "resource_type", "auto"
                    )
            );

            // Create ProductImage entity
            ProductImage image = new ProductImage();
            image.setImageUrl((String) uploadResult.get("secure_url"));
            image.setAltText(request.getAltText());
            image.setProduct(product);
            image.setActive(isActive);
            image.setVariant(variant);
            image.setPrimary(isPrimary);
            image.setPublicId((String) uploadResult.get("public_id"));

            // If marked as primary, unset other primary images
            if (isPrimary) {
                imageRepository.findByProductId(productId)
                        .forEach(img -> {
                            if (img.isPrimary()) {
                                img.setPrimary(false);
                                imageRepository.save(img);
                            }
                        });
            }

            return imageMapper.toResponse(imageRepository.save(image));
        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    @Transactional
    public ProductImageResponse updateImage(Long id, Boolean isActive, Boolean isPrimary, ProductImageUpdateRequest request) {
        ProductImage image = imageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
            validateImage(request.getImageFile());
        }

        try {
            // If there's a new image file
            if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
                // Delete old image from Cloudinary
                if (image.getPublicId() != null) {
                    cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
                }

                // Upload new image
                Map<?, ?> uploadResult = cloudinary.uploader().upload(
                        request.getImageFile().getBytes(),
                        ObjectUtils.asMap(
                                "folder", "products/" + image.getProduct().getId(),
                                "resource_type", "auto"
                        )
                );

                image.setImageUrl((String) uploadResult.get("secure_url"));
                image.setPublicId((String) uploadResult.get("public_id"));
            }

            // Update other fields
            if (request.getAltText() != null) {
                image.setAltText(request.getAltText());
            }

            if (isActive != null) {
                image.setActive(isActive);
            }

            // Handle primary image
            if (isPrimary != null) {
                imageRepository.findByProductId(image.getProduct().getId())
                        .forEach(img -> {
                            if (img.isPrimary()) {
                                img.setPrimary(false);
                                imageRepository.save(img);
                            }
                        });
                image.setPrimary(true);
            }

            return imageMapper.toResponse(imageRepository.save(image));
        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    @Transactional
    public void deleteImage(Long id) {
        ProductImage image = imageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        try {
            // Delete image from Cloudinary
            if (image.getPublicId() != null) {
                cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
            }
            // Delete from database
            imageRepository.delete(image);
        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    public ProductImageResponse getImageById(Long id) {
        ProductImage image = imageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
        return imageMapper.toResponse(image);
    }

    @Override
    public List<ProductImageSummary> getImagesByProduct(Long productId) {
        return imageMapper.toSummaryList(imageRepository.findByProductId(productId));
    }

    @Override
    @Transactional
    public void deleteImagesByProduct(Long productId) {
        List<ProductImage> images = imageRepository.findByProductId(productId);

        try {
            // Delete all images from Cloudinary
            for (ProductImage image : images) {
                if (image.getPublicId() != null) {
                    cloudinary.uploader().destroy(image.getPublicId(), ObjectUtils.emptyMap());
                }
            }
            // Delete from database
            imageRepository.deleteByProductId(productId);
        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    @Transactional
    public void toggleImageStatus(Long id) {
        ProductImage image = imageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
        image.setActive(!image.isActive());
        imageRepository.save(image);
    }

    @Override
    @Transactional
    public void setPrimaryImage(Long id) {
        ProductImage image = imageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        // Set all other images as non-primary
        imageRepository.findByProductId(image.getProduct().getId())
                .forEach(img -> {
                    if (img.isPrimary()) {
                        img.setPrimary(false);
                        imageRepository.save(img);
                    }
                });

        // Set the selected image as primary
        image.setPrimary(true);
        imageRepository.save(image);
    }

    @Override
    public List<ProductImageResponse> getImagesByVariantId(Long variantId) {
        List<ProductImage> images = imageRepository.findByVariantId(variantId);
        return imageMapper.toResponseList(images);
    }

    @Override
    public ProductImage findFirstByProduct_Id(Long productId) {
        ProductImage image = imageRepository.findFirstByProduct_Id(productId)
                .orElseThrow(() ->new AppException(ErrorCode.IMAGE_NOT_FOUND));
        return image;
    }
}
