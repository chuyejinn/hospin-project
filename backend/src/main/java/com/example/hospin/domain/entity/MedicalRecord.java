package com.example.hospin.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "medical_record")
public class MedicalRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate visitDate;     // DTO의 date와 매핑
    private String department;       // 예: 보존과
    private String doctor;           // 예: 구도원
    private String diagnosis;        // DTO의 content와 매핑
    private String prescription;     // 처방 내용
    private int treatmentFee;        // 일단 기본값 0

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}