package com.example.back_end.service.gender;

import com.example.back_end.dto.GenderDto;
import com.example.back_end.dto.response.category.CategorySummary;

import java.util.List;

public interface IGenderService {
    List<GenderDto> findAll();

    GenderDto findById(Long id);

    GenderDto findBySlug(String slug);

    List<CategorySummary> getCategoriesByGenderSlug(String slug);

    List<CategorySummary> getCategoriesByGenderId(Long genderId);

}
