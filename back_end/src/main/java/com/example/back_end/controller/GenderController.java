package com.example.back_end.controller;

import com.example.back_end.dto.GenderDto;
import com.example.back_end.dto.response.category.CategorySummary;
import com.example.back_end.service.gender.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genders")
@RequiredArgsConstructor
public class GenderController {

    private final GenderService genderService;

    /**
     * Method to get all genders
     *
     * @return JSON body contains list of gender information
     */
    @GetMapping
    public ResponseEntity<List<GenderDto>> getAllGenders() {
        return ResponseEntity.ok(genderService.findAll());
    }

    /**
     * Method to get gender by ID
     *
     * @param id: Gender's id
     * @return JSON body contains gender information
     */
    @GetMapping("/{id}")
    public ResponseEntity<GenderDto> getGenderById(@PathVariable Long id) {
        return ResponseEntity.ok(genderService.findById(id));
    }

    /**
     * Method to get gender by slug
     *
     * @param slug: Gender's slug
     * @return JSON body contains gender information
     */
    @GetMapping("/slug/{slug}")
    public ResponseEntity<GenderDto> getGenderBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(genderService.findBySlug(slug));
    }

    /**
     * Method to get categories by gender ID
     *
     * @param id: Gender's id
     * @return JSON body contains list of category summaries
     */
    @GetMapping("/{id}/categories")
    public ResponseEntity<List<CategorySummary>> getCategoriesByGenderId(@PathVariable Long id) {
        return ResponseEntity.ok(genderService.getCategoriesByGenderId(id));
    }

    /**
     * Method to get categories by gender slug
     *
     * @param slug: Gender's slug
     * @return JSON body contains list of category summaries
     */
    @GetMapping("/slug/{slug}/categories")
    public ResponseEntity<List<CategorySummary>> getCategoriesByGenderSlug(@PathVariable String slug) {
        return ResponseEntity.ok(genderService.getCategoriesByGenderSlug(slug));
    }
}
