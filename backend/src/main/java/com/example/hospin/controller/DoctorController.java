package com.example.hospin.controller;

import com.example.hospin.domain.entity.Doctor;
import com.example.hospin.dto.DoctorResponseDto;
import com.example.hospin.service.DoctorService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@SecurityRequirement(name = "BearerAuth")
@RequestMapping("/doctors")
public class DoctorController {

    private final DoctorService doctorService;

    @Operation(summary = "진료과별 의사 목록 조회")
    @GetMapping
    //@PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_DOCTOR')")
    public ResponseEntity<List<DoctorResponseDto>> getDoctorsByDepartment(
            @RequestParam Long departmentId) {
        return ResponseEntity.ok(doctorService.getDoctorsByDepartment(departmentId));
    }

    @Operation(summary = "의사 프로필 수정")
    @PutMapping("/{doctorId}")
    //@PreAuthorize("hasAuthority('ROLE_DOCTOR')")
    public ResponseEntity<DoctorResponseDto> updateDoctorProfile(
            @PathVariable Long doctorId,
            @RequestBody DoctorResponseDto dto) {
        return ResponseEntity.ok(doctorService.updateDoctor(doctorId, dto));
    }
}