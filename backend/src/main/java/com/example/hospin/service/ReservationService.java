package com.example.hospin.service;

import com.example.hospin.domain.entity.Doctor;
import com.example.hospin.domain.entity.Reservation;
import com.example.hospin.domain.entity.User;
import com.example.hospin.domain.entity.UserRole;
import com.example.hospin.dto.ReservationRequestDto;
import com.example.hospin.dto.ReservationResponseDto;
import com.example.hospin.repository.DoctorRepository;
import com.example.hospin.repository.ReservationRepository;
import com.example.hospin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;

    /** ✅ 예약 생성 (이름 + 전화번호 기반) */
    public ReservationResponseDto createReservation(ReservationRequestDto dto) {
        log.info("📅 [createReservation] 요청: {}", dto);

        // ✅ 1. 전화번호 정규화 (하이픈, 공백 제거)
        String normalizedPhone = dto.getPhone() != null
                ? dto.getPhone().replaceAll("[^0-9]", "") // 숫자만 남김
                : null;

        if (normalizedPhone == null || normalizedPhone.isEmpty()) {
            throw new IllegalArgumentException("전화번호는 필수 입력입니다.");
        }

        // ✅ 2. 이름 + 전화번호로 환자 검색 (없으면 새로 생성)
        User user = userRepository.findByUsernameAndPhone(dto.getUsername(), normalizedPhone)
                .orElseGet(() -> {
                    log.info("🆕 신규 환자 생성: {} / {}", dto.getUsername(), normalizedPhone);
                    User newUser = new User();
                    newUser.setUsername(dto.getUsername());
                    newUser.setPhone(normalizedPhone);
                    newUser.setRole(UserRole.PATIENT);
                    return userRepository.save(newUser);
                });

        // ✅ 3. 의사 조회
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 의사입니다. doctorId=" + dto.getDoctorId()));

        // ✅ 4. 예약 생성
        Reservation reservation = Reservation.builder()
                .doctor(doctor)
                .user(user)
                .date(LocalDate.parse(dto.getReservationDate()))
                .time(LocalTime.parse(dto.getReservationTime()))
                .build();

        reservationRepository.save(reservation);
        log.info("✅ [createReservation] 예약 저장 완료 (환자={}, 전화번호={})", user.getUsername(), normalizedPhone);

        // ✅ 5. 응답 DTO 반환
        return ReservationResponseDto.builder()
                .id(reservation.getId())
                .doctorName(doctor.getName())
                .department(doctor.getDepartment().getName())
                .date(reservation.getDate())
                .time(reservation.getTime())
                .build();
    }

    /** ✅ 내 예약 목록 조회 */
    public List<ReservationResponseDto> getMyReservations(User user) {
        List<Reservation> reservations = reservationRepository.findByUser(user);

        return reservations.stream()
                .map(r -> ReservationResponseDto.builder()
                        .id(r.getId())
                        .department(r.getDoctor().getDepartment().getName())
                        .doctorName(r.getDoctor().getName())
                        .date(r.getDate())
                        .time(r.getTime())
                        .build())
                .collect(Collectors.toList());
    }

    /** ✅ 전체 예약 목록 조회 (관리자/테스트용) */
    public List<ReservationResponseDto> getAllReservations() {
        List<Reservation> reservations = reservationRepository.findAll();

        return reservations.stream()
                .map(r -> ReservationResponseDto.builder()
                        .id(r.getId())
                        .department(r.getDoctor().getDepartment().getName())
                        .doctorName(r.getDoctor().getName())
                        .date(r.getDate())
                        .time(r.getTime())
                        .build())
                .collect(Collectors.toList());
    }

    /** ✅ 예약 취소 (로그인 사용자 전용) */
    public void cancelReservation(Long reservationId, User user) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("본인의 예약만 취소할 수 있습니다.");
        }

        reservationRepository.delete(reservation);
        log.info("🗑️ [cancelReservation] 사용자 예약 취소 완료 (id={}, user={})", reservationId, user.getUsername());
    }

    /** ✅ 예약 ID로 취소 (관리자/테스트용) */
    public void cancelReservationById(Long reservationId) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));
        reservationRepository.delete(reservation);
        log.info("🗑️ [cancelReservationById] 예약 삭제 완료 (id={})", reservationId);
    }
}