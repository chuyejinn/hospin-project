package com.example.hospin.dto;

import com.example.hospin.domain.entity.MedicalRecord;
import lombok.Getter;

import java.time.LocalDate;

@Getter
public class MedicalRecordResponseDto {
    private Long recordId;
    private LocalDate date;
    private String department;
    private String doctor;
    private String content;
    private String prescription;

    public MedicalRecordResponseDto(MedicalRecord record) {
        this.recordId = record.getId();
        this.date = record.getVisitDate();
        this.department = record.getDepartment();
        this.doctor = record.getDoctor();
        this.content = record.getDiagnosis();
        this.prescription = record.getPrescription();
    }
}