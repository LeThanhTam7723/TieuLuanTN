package com.example.back_end.service.status;

import com.example.back_end.dto.StatusDto;
import java.util.List;

public interface IStatusService {
    List<StatusDto> getAllStatuses();
}