package com.example.back_end.service.size;

import com.example.back_end.dto.SizeDto;
import com.example.back_end.entity.Size;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.SizeMapper;
import com.example.back_end.repository.SizeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SizeService implements ISizeService {
    private final SizeRepository sizeRepository;
    private final SizeMapper sizeMapper;

    @Override
    public List<SizeDto> getAllSizes() {
        return sizeRepository.findAll().stream()
                .map(sizeMapper::toDto)
                .toList();
    }

    @Override
    public SizeDto getSizeById(Long id) {
        Size size = sizeRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));
        return sizeMapper.toDto(size);
    }

    @Override
    public SizeDto getSizeByName(String name) {
        Size size = sizeRepository.findByName(name)
                .orElseThrow(() -> new AppException(ErrorCode.SIZE_NOT_FOUND));
        return sizeMapper.toDto(size);
    }

    @Override
    public boolean existsByName(String name) {
        return sizeRepository.existsByName(name);
    }
} 