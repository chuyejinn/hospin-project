package com.example.hospin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AiRecommendResponse {
    private String recommendedDepartment; // 추천된 진료과명
    private String reason; // 간단한 이유 (선택)
}