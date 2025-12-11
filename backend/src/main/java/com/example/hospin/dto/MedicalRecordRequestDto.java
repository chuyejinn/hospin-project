package com.example.hospin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MedicalRecordRequestDto {
    private String date;
    private String department;
    private String doctor;
    private String content;
    private String prescription;
    private Long userId; // ✅ 환자 ID 추가 (중요)
}