package com.example.hospin.controller;

import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.ReservationRequestDto;
import com.example.hospin.dto.ReservationResponseDto;
import com.example.hospin.security.UserDetailsImpl;
import com.example.hospin.service.ReservationService;
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
@RequestMapping("/reservations")
public class ReservationController {

    private final ReservationService reservationService;

    /** ✅ 예약 생성 */
    @Operation(summary = "예약 생성", description = "환자가 진료 예약을 등록합니다.")
    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")  // ✅ ROLE_ prefix 추가
    public ResponseEntity<ReservationResponseDto> createReservation(
            @RequestBody ReservationRequestDto dto,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User user = userDetails.getUser();
        ReservationResponseDto response = reservationService.createReservation(dto, user);
        return ResponseEntity.ok(response);
    }

    /** ✅ 내 예약 목록 조회 */
    @Operation(summary = "내 예약 목록 조회", description = "로그인한 사용자의 예약 내역을 조회합니다.")
    @GetMapping("/my")
    @PreAuthorize("hasAnyAuthority('ROLE_PATIENT', 'ROLE_DOCTOR')") // ✅ ROLE_ prefix 추가
    public ResponseEntity<List<ReservationResponseDto>> getMyReservations(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User user = userDetails.getUser();
        List<ReservationResponseDto> reservations = reservationService.getMyReservations(user);
        return ResponseEntity.ok(reservations);
    }

    /** ✅ 예약 취소 */
    @Operation(summary = "예약 취소", description = "예약 ID를 입력하여 자신의 예약을 취소합니다.")
    @DeleteMapping("/{reservationId}")
    @PreAuthorize("hasAuthority('ROLE_PATIENT')")  // ✅ ROLE_ prefix 추가
    public ResponseEntity<String> cancelReservation(
            @PathVariable Long reservationId,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {

        User user = userDetails.getUser();
        reservationService.cancelReservation(reservationId, user);
        return ResponseEntity.ok("예약이 성공적으로 취소되었습니다.");
    }
}