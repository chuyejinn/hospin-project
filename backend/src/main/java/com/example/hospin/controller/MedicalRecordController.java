package com.example.hospin.controller;

import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.MedicalRecordRequestDto;
import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.security.UserDetailsImpl;
import com.example.hospin.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@RequestMapping("/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    /** ✅ 진료기록 작성 */
    @Operation(summary = "진료 기록 등록", description = "의사가 환자 진료기록을 작성합니다.")
    @PostMapping
    public ResponseEntity<MedicalRecordResponseDto> createRecord(
            @RequestBody MedicalRecordRequestDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        // ✅ 로그인 안 되어 있어도 Swagger 테스트용으로 null 허용
        User doctor = null;
        if (userDetails != null) {
            doctor = userDetails.getUser();
        }

        log.info("🩺 [POST] 진료기록 등록 요청 - 환자ID={}, 의사={}",
                dto.getUserId(), (doctor != null ? doctor.getUsername() : "비로그인"));

        return ResponseEntity.ok(medicalRecordService.createRecord(dto, doctor));
    }

    /** ✅ 진료기록 수정 */
    @Operation(summary = "진료 기록 수정", description = "특정 진료 기록을 수정합니다.")
    @PutMapping("/{recordId}")
    public ResponseEntity<MedicalRecordResponseDto> updateRecord(
            @PathVariable Long recordId,
            @RequestBody MedicalRecordRequestDto dto) {

        log.info("✏️ [PUT] 진료기록 수정 요청 - ID={}", recordId);
        MedicalRecordResponseDto updated = medicalRecordService.updateRecord(recordId, dto);
        return ResponseEntity.ok(updated);
    }

    /** ✅ 진료기록 삭제 */
    @Operation(summary = "진료 기록 삭제", description = "특정 진료 기록을 삭제합니다.")
    @DeleteMapping("/{recordId}")
    public ResponseEntity<String> deleteRecord(@PathVariable Long recordId) {
        log.info("🗑️ [DELETE] 진료기록 삭제 요청 - ID={}", recordId);
        medicalRecordService.deleteRecord(recordId);
        return ResponseEntity.ok("진료 기록이 성공적으로 삭제되었습니다.");
    }

    /** ✅ 환자별 진료기록 조회 */
    @Operation(summary = "환자별 진료기록 조회", description = "특정 환자의 진료기록 목록을 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<List<MedicalRecordResponseDto>> getRecords(@PathVariable Long userId) {
        log.info("📋 [GET] 환자 진료기록 조회 요청 - userId={}", userId);
        return ResponseEntity.ok(medicalRecordService.getRecordsByUser(userId));
    }
}