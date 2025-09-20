package com.example.back_end.service.status;

import com.example.back_end.dto.StatusDto;
import com.example.back_end.entity.Status;
import com.example.back_end.repository.StatusRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatusService implements IStatusService {
    private final StatusRepository statusRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<StatusDto> getAllStatuses() {
        List<Status> statuses = statusRepository.findAll();
        // Ánh xạ danh sách Status entities sang danh sách StatusDto
        return statuses.stream()
                .map(status -> modelMapper.map(status, StatusDto.class))
                .collect(Collectors.toList());
    }
}