package com.example.hospin.service;

import com.example.hospin.domain.entity.Department;
import com.example.hospin.domain.entity.Doctor;
import com.example.hospin.dto.DoctorResponseDto;
import com.example.hospin.repository.DepartmentRepository;
import com.example.hospin.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    /**
     * ✅ 특정 진료과의 의사 목록 조회
     */
    public List<DoctorResponseDto> getDoctorsByDepartment(Long departmentId) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 진료과입니다."));

        return doctorRepository.findByDepartment(department)
                .stream()
                .map(DoctorResponseDto::fromEntity) // ✅ 깔끔하게 변경
                .collect(Collectors.toList());
    }

    /**
     * ✅ 의사 등록 (관리자용)
     */
    public DoctorResponseDto updateDoctor(Long doctorId, DoctorResponseDto dto) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("의사 정보를 찾을 수 없습니다."));

        // 수정 가능한 필드 업데이트
        doctor.setName(dto.getName());
        doctor.setSpecialization(dto.getSpecialization());
        doctor.setConsultationDays(dto.getConsultationDays());

        // 부서도 수정 가능하게 (선택적)
        if (dto.getDepartmentName() != null) {
            Department department = departmentRepository.findByName(dto.getDepartmentName())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 진료과입니다."));
            doctor.setDepartment(department);
        }

        doctorRepository.save(doctor);

        // 저장 후 DTO로 변환해서 반환
        return DoctorResponseDto.fromEntity(doctor);
    }
}