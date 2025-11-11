package com.example.hospin.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "doctor")
@Getter
@Setter   // ✅ setter 추가 (consultationDays 포함 전체 세터 자동 생성)
@NoArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;               // 의사 이름
    private String specialization;     // 전문 분야
    private String consultationDays;   // 진료일 (예: 월/수/금)

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "department_id")
    private Department department;

    // ✅ 진료과까지 포함한 생성자
    public Doctor(String name, String specialization, Department department) {
        this.name = name;
        this.specialization = specialization;
        this.department = department;
    }

    // ✅ 진료일(consultationDays)까지 포함하는 오버로딩 생성자
    public Doctor(String name, String specialization, String consultationDays, Department department) {
        this.name = name;
        this.specialization = specialization;
        this.consultationDays = consultationDays;
        this.department = department;
    }
}