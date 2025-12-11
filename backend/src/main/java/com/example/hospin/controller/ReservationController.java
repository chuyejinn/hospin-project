package com.example.hospin.controller;

import com.example.hospin.dto.ReservationRequestDto;
import com.example.hospin.dto.ReservationResponseDto;
import com.example.hospin.service.ReservationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    /** ✅ 예약 생성 (이름 + 전화번호 기반, 로그인 불필요) */
    @Operation(summary = "예약 생성", description = "이름과 전화번호를 입력받아 환자 정보를 확인하고 예약을 생성합니다.")
    @PostMapping
    public ResponseEntity<ReservationResponseDto> createReservation(@RequestBody ReservationRequestDto dto) {
        ReservationResponseDto response = reservationService.createReservation(dto);
        return ResponseEntity.ok(response);
    }

    /** ✅ 예약 목록 조회 (관리자/의사용 등 필요시 별도 권한 추가 가능) */
    @Operation(summary = "예약 목록 조회", description = "특정 조건에 따라 예약 내역을 조회합니다. (추후 권한 기반 확장 가능)")
    @GetMapping("/all")
    public ResponseEntity<List<ReservationResponseDto>> getAllReservations() {
        List<ReservationResponseDto> reservations = reservationService.getAllReservations();
        return ResponseEntity.ok(reservations);
    }

    /** ✅ 예약 취소 (이름 + 전화번호 기반 확인으로 변경 가능, 현재는 ID 기반) */
    @Operation(summary = "예약 취소", description = "예약 ID를 입력하여 예약을 취소합니다.")
    @DeleteMapping("/{reservationId}")
    public ResponseEntity<String> cancelReservation(@PathVariable Long reservationId) {
        reservationService.cancelReservationById(reservationId);
        return ResponseEntity.ok("예약이 성공적으로 취소되었습니다.");
    }
}