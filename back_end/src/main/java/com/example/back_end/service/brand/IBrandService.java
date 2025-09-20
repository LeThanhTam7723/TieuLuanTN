package com.example.back_end.service.brand;

import com.example.back_end.dto.BrandDto;
import java.util.List;

public interface IBrandService {
    List<BrandDto> getAllBrands();
    BrandDto getBrandById(Long id);
    BrandDto getBrandByName(String name);
}