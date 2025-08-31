package com.example.hospin.controller;

import com.example.hospin.dto.MedicalRecordResponseDto;
import com.example.hospin.service.MedicalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.NoSuchElementException;

@RestController
@RequestMapping("/medical-records")
@Tag(name = "medical-record-controller", description = "진료 기록 관련 API")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    @GetMapping("/{recordId}")
    @Operation(
            summary = "진료 기록 상세 조회",
            description = "recordId를 기반으로 진료 기록 상세 정보를 조회합니다."
    )
    public ResponseEntity<?> getMedicalRecord(@PathVariable Long recordId) {
        try {
            MedicalRecordResponseDto response = medicalRecordService.getRecordById(recordId);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(404).body("해당 진료 기록이 존재하지 않습니다.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("진료 기록 상세 조회 실패");
        }
    }
    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }

}