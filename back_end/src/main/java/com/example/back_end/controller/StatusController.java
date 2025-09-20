package com.example.back_end.controller;

import com.example.back_end.dto.StatusDto;
import com.example.back_end.dto.response.ApiResponse; // Để trả về ApiResponse
import com.example.back_end.service.status.IStatusService; // Dùng interface
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/status")
@RequiredArgsConstructor
public class StatusController {
    private final IStatusService statusService;

    @GetMapping("/all")
    public ApiResponse<List<StatusDto>> getAllStatuses() {
        List<StatusDto> statuses = statusService.getAllStatuses();
        return ApiResponse.<List<StatusDto>>builder()
                .code(0)
                .message("Lấy danh sách trạng thái thành công")
                .data(statuses)
                .build();
    }
}