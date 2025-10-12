package com.example.hospin.controller;

import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.MedicalRecordDetailDto;
import com.example.hospin.dto.MedicalRecordRequestDto;
import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.dto.MedicalRecordSummaryDto;
import com.example.hospin.security.UserDetailsImpl;
import com.example.hospin.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@RequestMapping("/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    /** 진료 기록 등록 */
    @PostMapping
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<?> createMedicalRecord(
            @RequestBody MedicalRecordRequestDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        try {
            User user = userDetails.getUser();
            MedicalRecordResponseDto responseDto = medicalRecordService.createRecord(dto, user);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("진료 기록 등록 실패\n" + e.getMessage());
        }
    }

    /** 진료 기록 단건 조회 */
    @GetMapping("/{recordId}")
    public ResponseEntity<?> getRecordById(@PathVariable Long recordId) {
        try {
            MedicalRecordResponseDto responseDto = medicalRecordService.getRecordById(recordId);
            return ResponseEntity.ok(responseDto);
        } catch (Exception e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    /** 연도별 요약 조회 */
    @GetMapping("/summary/{userId}")
    public ResponseEntity<List<MedicalRecordSummaryDto>> getSummary(@PathVariable Long userId) {
        return ResponseEntity.ok(medicalRecordService.getSummaryByUserId(userId));
    }

    /** 연월 상세 조회 */
    @GetMapping("/detail/{userId}")
    public ResponseEntity<List<MedicalRecordDetailDto>> getMonthlyDetail(
            @PathVariable Long userId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(medicalRecordService.getMonthlyDetail(userId, year, month));
    }
}