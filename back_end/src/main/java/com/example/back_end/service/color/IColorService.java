package com.example.back_end.service.color;

import com.example.back_end.dto.ColorDto;
import java.util.List;

public interface IColorService {
    List<ColorDto> getAllColors();
    
    ColorDto getColorById(Long id);
    
    ColorDto getColorByName(String name);
    
    boolean existsByName(String name);
} 