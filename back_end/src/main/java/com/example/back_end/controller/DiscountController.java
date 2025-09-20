package com.example.back_end.controller;

import com.example.back_end.dto.request.discount.DiscountCreationRequest;
import com.example.back_end.dto.request.discount.DiscountUpdateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.discount.DiscountResponse;
import com.example.back_end.entity.Discount;
import com.example.back_end.service.discount.DiscountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/discount")
public class DiscountController {
    private final DiscountService discountService;

    /**
     * Method to get discount by code
     *
     * @param code: Discount code to search for
     * @return JSON body contains discount information if found
     */
    @GetMapping("/getDiscount")
    public ApiResponse<Discount> getDiscount(@RequestParam String code) {
        Discount getDis = discountService.findByCode(code);
        return ApiResponse.<Discount>builder().result(getDis).build();
    }

    /**
     * Method to create a new discount
     *
     * @param request: Discount creation request containing code, name, description, and sale percent
     * @return JSON body contains created discount information
     */
    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<DiscountResponse> createDiscount(@RequestBody DiscountCreationRequest request) {
        return ResponseEntity.ok(discountService.createDiscount(request));
    }

    /**
     * Method to update an existing discount
     *
     * @param id: Discount's id
     * @param request: Discount update request containing fields to update
     * @return JSON body contains updated discount information
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<DiscountResponse> updateDiscount(
            @PathVariable Long id,
            @RequestBody DiscountUpdateRequest request) {
        return ResponseEntity.ok(discountService.updateDiscount(id, request));
    }

    /**
     * Method to delete a discount
     *
     * @param id: Discount's id
     * @return No content if discount deleted successfully
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get all discounts
     *
     * @return JSON body contains list of all discounts
     */
    @GetMapping
    public ResponseEntity<List<DiscountResponse>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    /**
     * Method to get discount by ID
     *
     * @param id: Discount's id
     * @return JSON body contains detailed discount information
     */
    @GetMapping("/{id}")
    public ResponseEntity<DiscountResponse> getDiscountById(@PathVariable Long id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }
}
