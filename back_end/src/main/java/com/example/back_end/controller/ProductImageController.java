package com.example.back_end.controller;

import com.example.back_end.dto.request.product.ProductImageCreationRequest;
import com.example.back_end.dto.request.product.ProductImageUpdateRequest;
import com.example.back_end.dto.response.product.ProductImageResponse;
import com.example.back_end.dto.response.product.ProductImageSummary;
import com.example.back_end.service.product.IProductImageService;
import com.example.back_end.service.product.ProductImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/products/{productId}/images")
@RequiredArgsConstructor
public class ProductImageController {
    private final IProductImageService imageService;
    private final ProductImageService productImageService;

    /**
     * Create a new product image with file upload.
     *
     * @param productId ID of the associated product (path variable).
     * @param variantId Optional ID of the product variant to link the image to (query/form parameter).
     * @param isActive  Whether the image should be active (default: true).
     * @param isPrimary Whether the image should be the primary display image (default: true).
     * @param request   Form data containing the image file and optional alt text.
     * @return ResponseEntity with the created ProductImageResponse.
     */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<ProductImageResponse> createImage(
            @PathVariable Long productId,
            @RequestParam(required = false) Long variantId,
            @RequestParam(defaultValue = "true") boolean isActive,
            @RequestParam(defaultValue = "true") boolean isPrimary,
            @ModelAttribute ProductImageCreationRequest request
    ) {
        return ResponseEntity.ok(
                imageService.createImage(productId, variantId, isActive, isPrimary, request)
        );
    }

    /**
     * Update existing image metadata and/or replace the image file.
     *
     * @param id        ID of the image to update (path variable).
     * @param isActive  Optional parameter to update the active status of the image (query/form parameter).
     * @param isPrimary Optional parameter to set/unset the image as primary (query/form parameter).
     * @param request   Form data containing optional alt text and/or a new image file.
     * @return ResponseEntity with the updated ProductImageResponse.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<ProductImageResponse> updateImage(
            @PathVariable Long id,
            @RequestParam(required = false) Boolean isActive,
            @RequestParam(required = false) Boolean isPrimary,
            @ModelAttribute ProductImageUpdateRequest request
    ) {
        return ResponseEntity.ok(imageService.updateImage(id, isActive, isPrimary, request));
    }

    /**
     * Delete a product image by ID.
     *
     * @param id ID of the image to delete (path variable).
     * @return ResponseEntity with no content.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImage(@PathVariable Long id) {
        imageService.deleteImage(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retrieve image details by ID.
     *
     * @param id ID of the image to fetch (path variable).
     * @return ResponseEntity with the ProductImageResponse.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductImageResponse> getImageById(@PathVariable Long id) {
        return ResponseEntity.ok(imageService.getImageById(id));
    }

    /**
     * List all images associated with a product.
     *
     * @param productId ID of the product to list images for (path variable).
     * @return ResponseEntity with a list of ProductImageSummary objects.
     */
    @GetMapping
    public ResponseEntity<List<ProductImageSummary>> getImagesByProduct(
            @PathVariable Long productId
    ) {
        return ResponseEntity.ok(imageService.getImagesByProduct(productId));
    }

    /**
     * Toggle the active status of an image.
     *
     * @param id ID of the image to toggle (path variable).
     * @return ResponseEntity with no content.
     */
    @PatchMapping("/{id}/toggle")
    public ResponseEntity<Void> toggleImageStatus(@PathVariable Long id) {
        imageService.toggleImageStatus(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Set an image as the primary display image for its product.
     * Demotes any existing primary image for the same product.
     *
     * @param id ID of the image to mark as primary (path variable).
     * @return ResponseEntity with no content.
     */
    @PatchMapping("/{id}/set-primary")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> setPrimaryImage(@PathVariable Long id) {
        imageService.setPrimaryImage(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Delete all images associated with a product.
     *
     * @param productId ID of the product to clear images for (path variable).
     * @return ResponseEntity with no content.
     */
    @DeleteMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> deleteImagesByProduct(@PathVariable Long productId) {
        imageService.deleteImagesByProduct(productId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/variant/{variantId}")
    public List<ProductImageResponse> getImagesByVariantId(@PathVariable Long variantId) {
        return productImageService.getImagesByVariantId(variantId);
    }

}