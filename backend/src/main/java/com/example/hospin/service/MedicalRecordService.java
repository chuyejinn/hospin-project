package com.example.hospin.service;

import com.example.hospin.domain.entity.MedicalRecord;
import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.MedicalRecordRequestDto;
import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.repository.MedicalRecordRepository;
import com.example.hospin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;

    /** ✅ 진료 기록 생성 */
    public MedicalRecordResponseDto createRecord(MedicalRecordRequestDto dto, User doctorUser) {
        MedicalRecord record = new MedicalRecord();

        try {
            log.info("📋 [createRecord] 요청 시작: {}", dto);

            // 날짜 파싱
            try {
                record.setVisitDate(LocalDate.parse(dto.getDate(), DateTimeFormatter.ISO_DATE));
            } catch (Exception e) {
                log.warn("⚠️ 날짜 파싱 실패, LocalDate.now()로 대체");
                record.setVisitDate(LocalDate.now());
            }

            record.setDepartment(dto.getDepartment());
            record.setDoctor(dto.getDoctor());
            record.setDiagnosis(dto.getContent());
            record.setPrescription(dto.getPrescription());
            record.setTreatmentFee(0);

            // 환자 설정
            if (dto.getUserId() == null) {
                throw new IllegalArgumentException("userId(환자 ID)가 필요합니다.");
            }
            User patient = userRepository.findById(dto.getUserId())
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 환자 userId=" + dto.getUserId()));
            record.setUser(patient);

            // 저장
            medicalRecordRepository.save(record);
            log.info("✅ 진료기록 저장 완료 (ID={})", record.getId());
            return new MedicalRecordResponseDto(record);

        } catch (Exception e) {
            log.error("❌ [createRecord] 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("진료기록 저장 중 오류: " + e.getMessage());
        }
    }

    /** ✅ 진료기록 수정 */
    public MedicalRecordResponseDto updateRecord(Long recordId, MedicalRecordRequestDto dto) {
        try {
            MedicalRecord record = medicalRecordRepository.findById(recordId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 진료기록 ID=" + recordId));

            log.info("✏️ [updateRecord] 수정 요청 - ID={}, 요청데이터={}", recordId, dto);

            // 날짜 업데이트
            if (dto.getDate() != null) {
                try {
                    record.setVisitDate(LocalDate.parse(dto.getDate(), DateTimeFormatter.ISO_DATE));
                } catch (Exception e) {
                    log.warn("⚠️ 날짜 파싱 실패, 기존 날짜 유지");
                }
            }

            // 변경 가능한 필드 업데이트
            if (dto.getDepartment() != null) record.setDepartment(dto.getDepartment());
            if (dto.getDoctor() != null) record.setDoctor(dto.getDoctor());
            if (dto.getContent() != null) record.setDiagnosis(dto.getContent());
            if (dto.getPrescription() != null) record.setPrescription(dto.getPrescription());

            medicalRecordRepository.save(record);
            log.info("✅ 진료기록 수정 완료 - ID={}", recordId);

            return new MedicalRecordResponseDto(record);

        } catch (Exception e) {
            log.error("❌ [updateRecord] 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("진료기록 수정 중 오류: " + e.getMessage());
        }
    }

    /** ✅ 진료기록 삭제 */
    public void deleteRecord(Long recordId) {
        try {
            MedicalRecord record = medicalRecordRepository.findById(recordId)
                    .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 진료기록 ID=" + recordId));

            medicalRecordRepository.delete(record);
            log.info("🗑️ 진료기록 삭제 완료 - ID={}", recordId);

        } catch (Exception e) {
            log.error("❌ [deleteRecord] 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("진료기록 삭제 중 오류: " + e.getMessage());
        }
    }

    /** ✅ 환자별 진료기록 조회 */
    public List<MedicalRecordResponseDto> getRecordsByUser(Long userId) {
        try {
            List<MedicalRecordResponseDto> records = medicalRecordRepository.findByUser_Id(userId)
                    .stream()
                    .map(MedicalRecordResponseDto::new)
                    .collect(Collectors.toList());
            log.info("📄 [getRecordsByUser] userId={} → {}건 조회됨", userId, records.size());
            return records;
        } catch (Exception e) {
            log.error("❌ [getRecordsByUser] 오류 발생: {}", e.getMessage(), e);
            throw new RuntimeException("진료기록 조회 중 오류: " + e.getMessage());
        }
    }
}