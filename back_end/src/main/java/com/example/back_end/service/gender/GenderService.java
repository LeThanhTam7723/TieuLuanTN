package com.example.back_end.service.gender;

import com.example.back_end.dto.GenderDto;
import com.example.back_end.dto.response.category.CategorySummary;
import com.example.back_end.entity.Gender;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.GenderMapper;
import com.example.back_end.repository.CategoryRepository;
import com.example.back_end.repository.GenderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GenderService implements IGenderService {

    private final GenderRepository genderRepository;
    private final CategoryRepository categoryRepository;
    private final GenderMapper genderMapper;

    public List<GenderDto> findAll() {
        return genderRepository.findAll().stream()
                .map(genderMapper::toDto)
                .collect(Collectors.toList());
    }

    public GenderDto findById(Long id) {
        Gender gender = genderRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND));
        return genderMapper.toDto(gender);
    }

    public GenderDto findBySlug(String slug) {
        Gender gender = genderRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND));
        return genderMapper.toDto(gender);
    }

    public List<CategorySummary> getCategoriesByGenderSlug(String slug) {
        Gender gender = genderRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND));
        return categoryRepository.findByGender(gender).stream()
                .map(category -> CategorySummary.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .parentId(category.getParent() != null ? category.getParent().getId() : null)
                        .parentName(category.getParent() != null ? category.getParent().getName() : null)
                        .slug(category.getSlug())
                        .build())
                .collect(Collectors.toList());
    }

    public List<CategorySummary> getCategoriesByGenderId(Long genderId) {
        Gender gender = genderRepository.findById(genderId)
                .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND));
        return categoryRepository.findByGender(gender).stream()
                .map(category -> CategorySummary.builder()
                        .id(category.getId())
                        .name(category.getName())
                        .description(category.getDescription())
                        .parentId(category.getParent() != null ? category.getParent().getId() : null)
                        .parentName(category.getParent() != null ? category.getParent().getName() : null)
                        .slug(category.getSlug())
                        .build())
                .collect(Collectors.toList());
    }
} 