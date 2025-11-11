package com.example.hospin.dto;

import com.example.hospin.domain.entity.Doctor;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DoctorResponseDto {
    private Long id;
    private String name;
    private String specialization; // ✅ 엔티티와 이름 맞춤
    private String consultationDays;
    private String departmentName; // ✅ 부서명만 응답용으로 표시

    public static DoctorResponseDto fromEntity(Doctor doctor) {
        return new DoctorResponseDto(
                doctor.getId(),
                doctor.getName(),
                doctor.getSpecialization(),
                doctor.getConsultationDays(),
                doctor.getDepartment() != null ? doctor.getDepartment().getName() : null
        );
    }
}