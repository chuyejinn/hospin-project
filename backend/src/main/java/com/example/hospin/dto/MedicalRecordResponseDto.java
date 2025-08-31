package com.example.hospin.dto;

import java.time.LocalDate;

public class MedicalRecordResponseDto {
    private Long recordId;
    private LocalDate date;
    private String department;
    private String doctor;        // 의사 이름
    private String content;       // 진료 내용
    private String prescription;  // 처방전

    public MedicalRecordResponseDto(Long recordId, LocalDate date, String department,
                                    String doctor, String content, String prescription) {
        this.recordId = recordId;
        this.date = date;
        this.department = department;
        this.doctor = doctor;
        this.content = content;
        this.prescription = prescription;
    }

    public Long getRecordId() { return recordId; }
    public LocalDate getDate() { return date; }
    public String getDepartment() { return department; }
    public String getDoctor() { return doctor; }
    public String getContent() { return content; }
    public String getPrescription() { return prescription; }
}

// 단건 조회용