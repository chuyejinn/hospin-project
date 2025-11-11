package com.example.hospin.controller;

import com.example.hospin.dto.AiRecommendRequest;
import com.example.hospin.dto.AiRecommendResponse;
import com.example.hospin.service.AiRecommendService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
public class AiRecommendController {

    private final AiRecommendService aiRecommendService;

    @PostMapping("/recommend")
    @Operation(summary = "AI 진료과 추천", description = "사용자 증상 텍스트를 기반으로 가장 적절한 진료과를 추천합니다.")
    public ResponseEntity<AiRecommendResponse> recommend(@RequestBody AiRecommendRequest request) {
        AiRecommendResponse response = aiRecommendService.recommendDepartment(request);
        return ResponseEntity.ok(response);
    }
}