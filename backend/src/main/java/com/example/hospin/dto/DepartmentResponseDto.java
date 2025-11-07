package com.example.hospin.dto;

import com.example.hospin.domain.entity.Department;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentResponseDto {
    private Long id;
    private String name;
    private String imageUrl;

    public static DepartmentResponseDto fromEntity(Department department) {
        DepartmentResponseDto dto = new DepartmentResponseDto();
        dto.setId(department.getId());
        dto.setName(department.getName());
        dto.setImageUrl(department.getImageUrl());
        return dto;
    }
}