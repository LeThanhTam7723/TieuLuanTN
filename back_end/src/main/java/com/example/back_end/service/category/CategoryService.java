package com.example.back_end.service.category;

import com.example.back_end.dto.request.category.CategoryCreationRequest;
import com.example.back_end.dto.request.category.UpdateCategoryRequest;
import com.example.back_end.dto.response.category.CategoryResponse;
import com.example.back_end.entity.Category;
import com.example.back_end.entity.Product;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.CategoryMapper;
import com.example.back_end.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.example.back_end.dto.response.PageResponse;
import com.example.back_end.entity.Gender;
import com.example.back_end.repository.GenderRepository;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CategoryService implements ICategoryService {
    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;
    private final GenderRepository genderRepository;

    @Override
    public CategoryResponse createCategory(CategoryCreationRequest request) {
        if (categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }

        String slug = generateSlug(request.getName());
        if (categoryRepository.existsBySlug(slug)) {
            throw new AppException(ErrorCode.CATEGORY_SLUG_EXISTS);
        }

        Category category = Category.builder()
                .name(request.getName())
                .slug(slug)
                .description(request.getDescription())
                .active(request.isActive())
                .build();

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            category.setParent(parent);
        }

        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));

        if (!category.getName().equals(request.getName()) && categoryRepository.existsByName(request.getName())) {
            throw new AppException(ErrorCode.CATEGORY_NAME_EXISTS);
        }

        // Generate new slug if name changed
        if (!category.getName().equals(request.getName())) {
            String newSlug = generateSlug(request.getName());
            if (!newSlug.equals(category.getSlug()) && categoryRepository.existsBySlug(newSlug)) {
                throw new AppException(ErrorCode.CATEGORY_SLUG_EXISTS);
            }
            category.setSlug(newSlug);
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        if (request.getParentId() != null) {
            Category parent = categoryRepository.findById(request.getParentId())
                    .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
            category.setParent(parent);
        } else {
            category.setParent(null);
        }

        category = categoryRepository.save(category);
        return categoryMapper.toResponse(category);
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        category.setActive(false);
        categoryRepository.save(category);
    }

    @Override
    public CategoryResponse getCategoryById(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(category);
    }

    @Override
    public PageResponse<CategoryResponse> getAllCategories(Pageable pageable) {
        Page<Category> categoryPage = categoryRepository.findAll(pageable);
        return PageResponse.<CategoryResponse>builder()
                .content(categoryPage.getContent().stream()
                        .map(categoryMapper::toResponse)
                        .toList())
                .pageNo(categoryPage.getNumber())
                .pageSize(categoryPage.getSize())
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .last(categoryPage.isLast())
                .build();
    }

    @Override
    @Transactional
    public void toggleCategoryStatus(Long id) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        category.setActive(!category.isActive());
        categoryRepository.save(category);
    }

    @Override
    public boolean existsByName(String name) {
        return categoryRepository.existsByName(name);
    }

    @Override
    public List<CategoryResponse> getSubCategoriesByParentId(Long parentId) {
        // Assume CategoryRepository has a method findAllByParentId(Long parentId)
        // You need to implement this method in CategoryRepository.
        List<Category> subCategories = categoryRepository.findAllByParentId(parentId);
        return subCategories.stream()
                .map(categoryMapper::toResponse)
                .toList();
    }

    @Override
    public CategoryResponse getCategoryByName(String name) {
        Category category = categoryRepository.findByName(name)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(category);
    }

    @Override
    public CategoryResponse getCategoryBySlug(String slug) {
        Category category = categoryRepository.findBySlugWithSubcategories(slug)
                .orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        return categoryMapper.toResponse(category);
    }

    @Override
    public boolean existsBySlug(String slug) {
        return categoryRepository.existsBySlug(slug);
    }

    @Override
    public List<CategoryResponse> getCategoriesByGender(Long genderId) {
        Gender gender = genderRepository.findById(genderId)
                .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND));
        return categoryRepository.findByGender(gender).stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getCategoriesByGenderSlug(String genderSlug) {
        Gender gender = genderRepository.findBySlug(genderSlug)
                .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND));
        return categoryRepository.findByGender(gender).stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<CategoryResponse> getSubCategoriesByGenderSlug(String genderSlug) {
        Gender gender = genderRepository.findBySlug(genderSlug)
                .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND));
        return categoryRepository.findSubCategoriesByGenderSlug(genderSlug).stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());
    }

    private String generateSlug(String name) {
        // Convert to lowercase and replace spaces with hyphens
        String baseSlug = name.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "") // Remove special characters
                .replaceAll("\\s+", "-")         // Replace spaces with hyphens
                .replaceAll("-+", "-");          // Replace multiple hyphens with single hyphen

        String slug = baseSlug;
        int counter = 1;

        // Keep adding numbers until we find a unique slug
        while (categoryRepository.existsBySlug(slug)) {
            slug = baseSlug + "-" + counter++;
        }

        return slug;
    }

    @Override
    public PageResponse<CategoryResponse> searchCategories(String keyword, Pageable pageable) {
        Page<Category> categoryPage = categoryRepository.searchCategories(keyword, pageable);
        List<CategoryResponse> categoryResponses = categoryPage.getContent().stream()
                .map(categoryMapper::toResponse)
                .collect(Collectors.toList());

        return PageResponse.<CategoryResponse>builder()
                .content(categoryResponses)
                .pageNo(categoryPage.getNumber())
                .pageSize(categoryPage.getSize())
                .totalElements(categoryPage.getTotalElements())
                .totalPages(categoryPage.getTotalPages())
                .last(categoryPage.isLast())
                .build();
    }
} 