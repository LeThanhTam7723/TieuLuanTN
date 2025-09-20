package com.example.back_end.service.category;

import com.example.back_end.dto.request.category.CategoryCreationRequest;
import com.example.back_end.dto.request.category.UpdateCategoryRequest;
import com.example.back_end.dto.response.category.CategoryResponse;
import org.springframework.data.domain.Pageable;
import com.example.back_end.dto.response.PageResponse;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

public interface ICategoryService {
    CategoryResponse createCategory(CategoryCreationRequest request);
    
    CategoryResponse updateCategory(Long id, UpdateCategoryRequest request);
    
    void deleteCategory(Long id);
    
    CategoryResponse getCategoryById(Long id);
    
    CategoryResponse getCategoryBySlug(String slug);
    
    boolean existsBySlug(String slug);
    
    PageResponse<CategoryResponse> getAllCategories(Pageable pageable);
    
    void toggleCategoryStatus(Long id);
    
    boolean existsByName(String name);

    List<CategoryResponse> getSubCategoriesByParentId(Long parentId);

    CategoryResponse getCategoryByName(String name);

    List<CategoryResponse> getCategoriesByGender(Long genderId);

    List<CategoryResponse> getCategoriesByGenderSlug(String genderSlug);

    List<CategoryResponse> getSubCategoriesByGenderSlug(String genderSlug);

    PageResponse<CategoryResponse> searchCategories(String keyword, Pageable pageable);
} 