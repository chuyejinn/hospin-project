package com.example.hospin.service;

import com.example.hospin.domain.entity.Doctor;
import com.example.hospin.domain.entity.Reservation;
import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.ReservationRequestDto;
import com.example.hospin.dto.ReservationResponseDto;
import com.example.hospin.repository.DoctorRepository;
import com.example.hospin.repository.ReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final DoctorRepository doctorRepository;

    /** ✅ 예약 생성 */
    public ReservationResponseDto createReservation(ReservationRequestDto dto, User user) {

        // ✅ doctorId 로 의사 조회
        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 의사입니다."));

        // ✅ 예약 엔티티 생성 (department는 doctor에서 가져옴)
        Reservation reservation = Reservation.builder()
                .doctor(doctor)
                .user(user)
                .date(LocalDate.parse(dto.getReservationDate()))
                .time(LocalTime.parse(dto.getReservationTime()))
                .build();

        reservationRepository.save(reservation);

        // ✅ 응답 DTO 반환
        return ReservationResponseDto.builder()
                .id(reservation.getId())
                .doctorName(doctor.getName())
                .department(doctor.getDepartment().getName()) // doctor를 통해 부서명 가져오기
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

    /** ✅ 예약 취소 */
    public void cancelReservation(Long reservationId, User user) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("존재하지 않는 예약입니다."));

        if (!reservation.getUser().getId().equals(user.getId())) {
            throw new IllegalStateException("본인의 예약만 취소할 수 있습니다.");
        }

        reservationRepository.delete(reservation);
    }
}