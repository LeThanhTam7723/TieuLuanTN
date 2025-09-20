package com.example.back_end.service.category;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.back_end.dto.request.category.CategoryImageCreationRequest;
import com.example.back_end.dto.request.category.CategoryImageUpdateRequest;
import com.example.back_end.dto.response.category.CategoryImageResponse;
import com.example.back_end.entity.Category;
import com.example.back_end.entity.CategoryImage;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.CategoryImageMapper;
import com.example.back_end.repository.CategoryImageRepository;
import com.example.back_end.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryImageService implements ICategoryImageService {
    private static final long MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_IMAGE_TYPES = List.of("image/jpeg", "image/png", "image/gif");

    private final CategoryImageRepository categoryImageRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryImageMapper categoryImageMapper;
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
    public CategoryImageResponse createImage(Long categoryId, CategoryImageCreationRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (categoryImageRepository.findByCategoryId(categoryId).isPresent()) {
            throw new AppException(ErrorCode.CATEGORY_IMAGE_ALREADY_EXISTS);
        }

        validateImage(request.getImageFile());

        try {
            // Upload image to Cloudinary
            Map<?, ?> uploadResult = cloudinary.uploader().upload(
                    request.getImageFile().getBytes(),
                    ObjectUtils.asMap(
                            "folder", "categories/" + categoryId,
                            "resource_type", "auto"
                    )
            );

            // Create CategoryImage entity
            CategoryImage categoryImage = new CategoryImage();
            categoryImage.setImageUrl((String) uploadResult.get("secure_url"));
            categoryImage.setAltText(request.getAltText());
            categoryImage.setCategory(category);
            categoryImage.setPublicId((String) uploadResult.get("public_id"));

            categoryImage = categoryImageRepository.save(categoryImage);
            return categoryImageMapper.toResponse(categoryImage);
        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    public CategoryImageResponse updateImage(Long categoryId, CategoryImageUpdateRequest request) {
        CategoryImage categoryImage = categoryImageRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_IMAGE_NOT_FOUND));

        if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
            validateImage(request.getImageFile());
        }

        try {
            // If there's a new image file
            if (request.getImageFile() != null && !request.getImageFile().isEmpty()) {
                // Delete old image from Cloudinary
                if (categoryImage.getPublicId() != null) {
                    cloudinary.uploader().destroy(categoryImage.getPublicId(), ObjectUtils.emptyMap());
                }

                // Upload new image
                Map<?, ?> uploadResult = cloudinary.uploader().upload(
                        request.getImageFile().getBytes(),
                        ObjectUtils.asMap(
                                "folder", "categories/" + categoryId,
                                "resource_type", "auto"
                        )
                );

                categoryImage.setImageUrl((String) uploadResult.get("secure_url"));
                categoryImage.setPublicId((String) uploadResult.get("public_id"));
            }

            // Update other fields
            if (request.getAltText() != null) {
                categoryImage.setAltText(request.getAltText());
            }

            categoryImage = categoryImageRepository.save(categoryImage);
            return categoryImageMapper.toResponse(categoryImage);
        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    public void deleteImage(Long categoryId) {
        CategoryImage categoryImage = categoryImageRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_IMAGE_NOT_FOUND));

        try {
            // Delete image from Cloudinary
            if (categoryImage.getPublicId() != null) {
                cloudinary.uploader().destroy(categoryImage.getPublicId(), ObjectUtils.emptyMap());
            }
            // Delete from database
            categoryImageRepository.delete(categoryImage);
        } catch (IOException e) {
            throw new AppException(ErrorCode.CLOUDINARY_ERROR);
        }
    }

    @Override
    public CategoryImageResponse getCategoryImage(Long categoryId) {
        CategoryImage categoryImage = categoryImageRepository.findByCategoryId(categoryId)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_IMAGE_NOT_FOUND));
        return categoryImageMapper.toResponse(categoryImage);
    }
} 