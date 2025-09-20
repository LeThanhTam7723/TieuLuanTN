package com.example.back_end.controller;

import com.example.back_end.dto.request.category.CategoryImageCreationRequest;
import com.example.back_end.dto.request.category.CategoryImageUpdateRequest;
import com.example.back_end.dto.response.category.CategoryImageResponse;
import com.example.back_end.service.category.ICategoryImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/categories/{categoryId}/image")
@RequiredArgsConstructor
public class CategoryImageController {
    private final ICategoryImageService categoryImageService;

    /**
     * Method to create a new category image
     *
     * @param categoryId: Category's id
     * @param request: Category image creation request containing image file and alt text
     * @return JSON body contains created category image information
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<CategoryImageResponse> createImage(
            @PathVariable Long categoryId,
            @ModelAttribute CategoryImageCreationRequest request) {
        return ResponseEntity.ok(categoryImageService.createImage(categoryId, request));
    }

    /**
     * Method to update an existing category image
     *
     * @param categoryId: Category's id
     * @param request: Category image update request containing new image file and alt text
     * @return JSON body contains updated category image information
     */
    @PutMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<CategoryImageResponse> updateImage(
            @PathVariable Long categoryId,
            @ModelAttribute CategoryImageUpdateRequest request) {
        return ResponseEntity.ok(categoryImageService.updateImage(categoryId, request));
    }

    /**
     * Method to delete a category image
     *
     * @param categoryId: Category's id
     * @return No content if image deleted successfully
     */
    @DeleteMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> deleteImage(@PathVariable Long categoryId) {
        categoryImageService.deleteImage(categoryId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get category image
     *
     * @param categoryId: Category's id
     * @return JSON body contains category image information
     */
    @GetMapping
    public ResponseEntity<CategoryImageResponse> getCategoryImage(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryImageService.getCategoryImage(categoryId));
    }
} 