package com.example.hospin.controller;

import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.MedicalRecordRequestDto;
import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.security.UserDetailsImpl;
import com.example.hospin.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@RequestMapping("/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    /** ✅ 진료기록 작성 (의사 전용) */
    @Operation(summary = "진료 기록 등록", description = "의사가 환자 진료기록을 작성합니다.")
    @PostMapping
    @PreAuthorize("hasAuthority('DOCTOR')")
    public ResponseEntity<MedicalRecordResponseDto> createRecord(
            @RequestBody MedicalRecordRequestDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User doctor = userDetails.getUser(); // JWT 인증된 로그인 사용자 (의사)
        return ResponseEntity.ok(medicalRecordService.createRecord(dto, doctor));
    }

    /** ✅ 환자별 진료기록 조회 (의사 또는 환자 본인) */
    @Operation(summary = "환자별 진료기록 조회", description = "의사 또는 환자 본인이 자신의 진료기록을 조회합니다.")
    @GetMapping("/{userId}")
    @PreAuthorize("hasAnyAuthority('PATIENT', 'DOCTOR')")
    public ResponseEntity<List<MedicalRecordResponseDto>> getRecords(@PathVariable Long userId) {
        return ResponseEntity.ok(medicalRecordService.getRecordsByUser(userId));
    }
}