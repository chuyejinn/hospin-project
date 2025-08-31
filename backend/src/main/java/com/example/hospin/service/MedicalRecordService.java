package com.example.hospin.service;

import com.example.hospin.domain.entity.MedicalRecord;
import com.example.hospin.dto.MedicalRecordDetailDto;
import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.dto.MedicalRecordSummaryDto;
import com.example.hospin.repository.MedicalRecordRepository;
import org.springframework.stereotype.Service;

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

    public MedicalRecordResponseDto getRecordById(Long recordId) {
        MedicalRecord record = medicalRecordRepository.findById(recordId)
                .orElseThrow(() -> new NoSuchElementException("해당 진료 기록이 존재하지 않습니다."));

        return new MedicalRecordResponseDto(
                record.getId(),
                record.getVisitDate(),
                record.getDepartment(),
                "임의의사",                  // doctor
                record.getDiagnosis(),      // content 대신
                "진통제 3번 복용"           // prescription 임시
        );
    }
}