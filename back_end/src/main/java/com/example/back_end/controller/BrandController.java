package com.example.back_end.controller;

import com.example.back_end.dto.BrandDto;
import com.example.back_end.service.brand.IBrandService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/brands")
@RequiredArgsConstructor
public class BrandController {
    private final IBrandService brandService;

    /**
     * Method to get all brands
     *
     * @return JSON body contains list of brand information
     */
    @GetMapping
    public ResponseEntity<List<BrandDto>> getAllBrands() {
        return ResponseEntity.ok(brandService.getAllBrands());
    }

    /**
     * Method to get brand by ID
     *
     * @param id: Brand's id
     * @return JSON body contains brand information
     */
    @GetMapping("/{id}")
    public ResponseEntity<BrandDto> getBrandById(@PathVariable Long id) {
        return ResponseEntity.ok(brandService.getBrandById(id));
    }

    /**
     * Method to get brand by name
     *
     * @param name: Brand's name
     * @return JSON body contains brand information
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<BrandDto> getBrandByName(@PathVariable String name) {
        return ResponseEntity.ok(brandService.getBrandByName(name));
    }
}