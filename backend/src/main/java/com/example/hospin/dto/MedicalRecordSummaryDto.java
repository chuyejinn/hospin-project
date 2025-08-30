package com.example.hospin.dto;

public class MedicalRecordSummaryDto {
    private int year;
    private long totalVisits;
    private int totalCost;
    private String lastDepartment;

    public MedicalRecordSummaryDto(int year, long totalVisits, int totalCost, String lastDepartment) {
        this.year = year;
        this.totalVisits = totalVisits;
        this.totalCost = totalCost;
        this.lastDepartment = lastDepartment;
    }

    public int getYear() { return year; }
    public long getTotalVisits() { return totalVisits; }
    public int getTotalCost() { return totalCost; }
    public String getLastDepartment() { return lastDepartment; }
}