package com.example.hospin.dto;

import java.time.LocalDate;

public class MedicalRecordDetailDto {
    private LocalDate visitDate;
    private String department;
    private String diagnosis;
    private int treatmentFee;

    public MedicalRecordDetailDto(LocalDate visitDate, String department, String diagnosis, int treatmentFee) {
        this.visitDate = visitDate;
        this.department = department;
        this.diagnosis = diagnosis;
        this.treatmentFee = treatmentFee;
    }

    public LocalDate getVisitDate() { return visitDate; }
    public String getDepartment() { return department; }
    public String getDiagnosis() { return diagnosis; }
    public int getTreatmentFee() { return treatmentFee; }
}