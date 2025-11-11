package com.example.hospin.service;

import com.example.hospin.domain.entity.MedicalRecord;
import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.MedicalRecordRequestDto;
import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.repository.MedicalRecordRepository;
import com.example.hospin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;
    private final UserRepository userRepository;

    /** ✅ 진료 기록 생성 */
    public MedicalRecordResponseDto createRecord(MedicalRecordRequestDto dto, User user) {
        MedicalRecord record = new MedicalRecord();
        record.setUser(user);
        record.setVisitDate(LocalDate.parse(dto.getDate()));
        record.setDepartment(dto.getDepartment());
        record.setDoctor(dto.getDoctor());
        record.setDiagnosis(dto.getContent());
        record.setPrescription(dto.getPrescription());
        record.setTreatmentFee(0); // 필요시 계산 로직 추가

        medicalRecordRepository.save(record);

        return new MedicalRecordResponseDto(record);
    }

    /** ✅ 환자별 진료 기록 조회 */
    public List<MedicalRecordResponseDto> getRecordsByUser(Long userId) {
        List<MedicalRecord> records = medicalRecordRepository.findByUser_Id(userId);
        return records.stream()
                .map(MedicalRecordResponseDto::new)
                .collect(Collectors.toList());
    }
}