package com.example.back_end.service.brand;

import com.example.back_end.dto.BrandDto;
import com.example.back_end.entity.Brand;
import com.example.back_end.exception.ResourceNotFoundException;
import com.example.back_end.mapper.BrandMapper;
import com.example.back_end.repository.BrandRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BrandService implements IBrandService {

    private final BrandRepository brandRepository;
    private final BrandMapper brandMapper;

    @Autowired
    public BrandService(BrandRepository brandRepository, BrandMapper brandMapper) {
        this.brandRepository = brandRepository;
        this.brandMapper = brandMapper;
    }

    @Override
    public List<BrandDto> getAllBrands() {
        List<Brand> brands = brandRepository.findAll();
        return brands.stream()
                .map(brandMapper::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public BrandDto getBrandById(Long id) {
        Brand brand = brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with id: " + id));
        return brandMapper.toDto(brand);
    }

    @Override
    public BrandDto getBrandByName(String name) {
        Brand brand = brandRepository.findByName(name)
                .orElseThrow(() -> new ResourceNotFoundException("Brand not found with name: " + name));
        return brandMapper.toDto(brand);
    }
}
