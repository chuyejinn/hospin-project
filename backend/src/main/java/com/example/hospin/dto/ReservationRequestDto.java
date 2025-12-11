package com.example.hospin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReservationRequestDto {
    private String username;          // ✅ 사용자 이름
    private String phone;             // ✅ 사용자 전화번호
    private Long doctorId;
    private String reservationDate;
    private String reservationTime;
}