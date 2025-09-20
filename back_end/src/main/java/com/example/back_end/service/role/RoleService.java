package com.example.back_end.service.role;

import com.example.back_end.dto.response.role.RoleResponse;
import com.example.back_end.mapper.RoleMapper; // Sẽ tạo RoleMapper
import com.example.back_end.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class RoleService implements IRoleService {
    private final RoleRepository roleRepository;
    private final RoleMapper roleMapper;

    @Override
    public List<RoleResponse> getAllRoles() {
        return roleRepository.findAll().stream()
                .map(roleMapper::toResponse)
                .collect(Collectors.toList());
    }
}