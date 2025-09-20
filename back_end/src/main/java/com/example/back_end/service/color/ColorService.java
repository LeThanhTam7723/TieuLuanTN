package com.example.back_end.service.color;

import com.example.back_end.dto.ColorDto;
import com.example.back_end.entity.Color;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ColorMapper;
import com.example.back_end.repository.ColorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ColorService implements IColorService {
    private final ColorRepository colorRepository;
    private final ColorMapper colorMapper;

    @Override
    public List<ColorDto> getAllColors() {
        return colorRepository.findAll().stream()
                .map(colorMapper::toDto)
                .toList();
    }

    @Override
    public ColorDto getColorById(Long id) {
        Color color = colorRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
        return colorMapper.toDto(color);
    }

    @Override
    public ColorDto getColorByName(String name) {
        Color color = colorRepository.findByName(name)
                .orElseThrow(() -> new AppException(ErrorCode.COLOR_NOT_FOUND));
        return colorMapper.toDto(color);
    }

    @Override
    public boolean existsByName(String name) {
        return colorRepository.existsByName(name);
    }
} 