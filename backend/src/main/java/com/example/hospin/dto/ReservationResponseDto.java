package com.example.hospin.dto;

import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponseDto {
    private Long id;
    private String doctorName;
    private String department;
    private LocalDate date;
    private LocalTime time;
    private String status;
}