package com.example.hospin.service;

import com.example.hospin.domain.entity.Department;
import com.example.hospin.dto.DepartmentResponseDto;
import com.example.hospin.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentResponseDto> getAllDepartments() {
        return departmentRepository.findAll()
                .stream()
                .map(dept -> new DepartmentResponseDto(
                        dept.getId(),
                        dept.getName(),
                        dept.getImageUrl()
                ))
                .toList();
    }
    public DepartmentResponseDto getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 진료과가 존재하지 않습니다."));
        return DepartmentResponseDto.fromEntity(department);
    }
}