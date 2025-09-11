package com.example.hospin.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter  // ✅ setter 자동 생성
@NoArgsConstructor
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 자동 생성
    private Long id;

    private LocalDate visitDate;
    private String department;
    private String doctor;
    private String diagnosis;
    private String prescription;
    private int treatmentFee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}