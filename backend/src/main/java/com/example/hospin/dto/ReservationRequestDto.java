package com.example.hospin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequestDto {
    private Long departmentId;      // 진료과 ID
    private Long doctorId;          // 의사 ID
    private String reservationDate; // 예약 날짜 (yyyy-MM-dd)
    private String reservationTime; // 예약 시간 (HH:mm)
}