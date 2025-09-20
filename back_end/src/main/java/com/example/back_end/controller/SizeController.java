package com.example.back_end.controller;

import com.example.back_end.dto.SizeDto;
import com.example.back_end.service.size.ISizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sizes")
@RequiredArgsConstructor
public class SizeController {
    private final ISizeService sizeService;

    /**
     * Method to get all sizes
     *
     * @return JSON body contains list of size information
     */
    @GetMapping
    public ResponseEntity<List<SizeDto>> getAllSizes() {
        return ResponseEntity.ok(sizeService.getAllSizes());
    }

    /**
     * Method to get size by ID
     *
     * @param id: Size's id
     * @return JSON body contains size information
     */
    @GetMapping("/{id}")
    public ResponseEntity<SizeDto> getSizeById(@PathVariable Long id) {
        return ResponseEntity.ok(sizeService.getSizeById(id));
    }

    /**
     * Method to get size by name
     *
     * @param name: Size's name
     * @return JSON body contains size information
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<SizeDto> getSizeByName(@PathVariable String name) {
        return ResponseEntity.ok(sizeService.getSizeByName(name));
    }
} 