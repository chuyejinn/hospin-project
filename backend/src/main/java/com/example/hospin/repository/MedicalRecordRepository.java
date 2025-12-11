package com.example.hospin.repository;

import com.example.hospin.domain.entity.MedicalRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedicalRecordRepository extends JpaRepository<MedicalRecord, Long> {

    /**
     * ✅ 특정 환자(userId)의 진료 기록 전체 조회
     * MedicalRecord.user 필드의 id 값을 기준으로 자동 쿼리 생성됨
     * 즉: SELECT * FROM medical_record WHERE user_id = ?
     */
    List<MedicalRecord> findByUser_Id(Long userId);
}