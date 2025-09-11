package com.example.hospin.service;

import com.example.hospin.domain.entity.MedicalRecord;
import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.MedicalRecordDetailDto;
import com.example.hospin.dto.MedicalRecordRequestDto;
import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.dto.MedicalRecordSummaryDto;
import com.example.hospin.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MedicalRecordService {

    private final MedicalRecordRepository medicalRecordRepository;

    public MedicalRecordService(MedicalRecordRepository medicalRecordRepository) {
        this.medicalRecordRepository = medicalRecordRepository;
    }

    /** 연도별 요약 조회 */
    public List<MedicalRecordSummaryDto> getSummaryByUserId(Long userId) {
        List<MedicalRecord> records = medicalRecordRepository.findByUser_Id(userId);

        Map<Integer, List<MedicalRecord>> groupedByYear = records.stream()
                .collect(Collectors.groupingBy(r -> r.getVisitDate().getYear()));

        List<MedicalRecordSummaryDto> summaryList = new ArrayList<>();
        for (Map.Entry<Integer, List<MedicalRecord>> entry : groupedByYear.entrySet()) {
            int year = entry.getKey();
            List<MedicalRecord> yearRecords = entry.getValue();

            long count = yearRecords.size();
            int totalCost = yearRecords.stream().mapToInt(MedicalRecord::getTreatmentFee).sum();
            String lastDepartment = yearRecords.get(yearRecords.size() - 1).getDepartment();

            summaryList.add(new MedicalRecordSummaryDto(year, count, totalCost, lastDepartment));
        }
        return summaryList;
    }

    /** 특정 연월 상세 조회 */
    public List<MedicalRecordDetailDto> getMonthlyDetail(Long userId, int year, int month) {
        List<MedicalRecord> records = medicalRecordRepository.findByUser_Id(userId);

        return records.stream()
                .filter(r -> r.getVisitDate().getYear() == year &&
                        r.getVisitDate().getMonthValue() == month)
                .map(r -> new MedicalRecordDetailDto(
                        r.getVisitDate(),
                        r.getDepartment(),
                        r.getDiagnosis(),
                        r.getTreatmentFee()
                ))
                .collect(Collectors.toList());
    }

    /** 진료 기록 단건 조회 */
    public MedicalRecordResponseDto getRecordById(Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new NoSuchElementException("해당 진료 기록이 존재하지 않습니다."));
        return new MedicalRecordResponseDto(record);
    }

    /** 진료 기록 등록 */
    public MedicalRecordResponseDto createRecord(MedicalRecordRequestDto dto, User user) {
        MedicalRecord record = new MedicalRecord();
        record.setVisitDate(LocalDate.parse(dto.getDate()));
        record.setDepartment(dto.getDepartment());
        record.setDoctor(dto.getDoctor());
        record.setDiagnosis(dto.getContent());
        record.setPrescription(dto.getPrescription());
        record.setUser(user); // ✅ 핵심 추가

        MedicalRecord saved = medicalRecordRepository.save(record);
        return new MedicalRecordResponseDto(saved);
    }
}