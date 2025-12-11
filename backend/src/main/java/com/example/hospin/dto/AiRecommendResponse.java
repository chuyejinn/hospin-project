package com.example.hospin.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class AiRecommendResponse {
    private String message;
    private String recommendedDepartment;
}