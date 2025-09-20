package com.example.back_end.controller;

import com.example.back_end.dto.ColorDto;
import com.example.back_end.service.color.IColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/colors")
@RequiredArgsConstructor
public class ColorController {
    private final IColorService colorService;

    /**
     * Method to get all colors
     *
     * @return JSON body contains list of color information
     */
    @GetMapping
    public ResponseEntity<List<ColorDto>> getAllColors() {
        return ResponseEntity.ok(colorService.getAllColors());
    }

    /**
     * Method to get color by ID
     *
     * @param id: Color's id
     * @return JSON body contains color information
     */
    @GetMapping("/{id}")
    public ResponseEntity<ColorDto> getColorById(@PathVariable Long id) {
        return ResponseEntity.ok(colorService.getColorById(id));
    }

    /**
     * Method to get color by name
     *
     * @param name: Color's name
     * @return JSON body contains color information
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<ColorDto> getColorByName(@PathVariable String name) {
        return ResponseEntity.ok(colorService.getColorByName(name));
    }
} 