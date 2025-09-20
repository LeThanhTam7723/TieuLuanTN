package com.example.back_end.service.size;

import com.example.back_end.dto.SizeDto;
import java.util.List;

public interface ISizeService {
    List<SizeDto> getAllSizes();
    
    SizeDto getSizeById(Long id);
    
    SizeDto getSizeByName(String name);
    
    boolean existsByName(String name);
} 