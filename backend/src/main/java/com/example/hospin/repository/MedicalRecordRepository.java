package com.example.hospin.repository;

import com.example.hospin.domain.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    // ✅ User 엔티티의 id 기준으로 조회
    List<MedicalRecord> findByUser_Id(Long userId);

}