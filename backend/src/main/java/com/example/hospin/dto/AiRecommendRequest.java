package com.example.hospin.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AiRecommendRequest {
    private String symptom; // 사용자 입력 증상
}