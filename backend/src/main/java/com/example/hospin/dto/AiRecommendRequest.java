package com.example.hospin.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class AiRecommendRequest {
    private List<String> symptoms;
}