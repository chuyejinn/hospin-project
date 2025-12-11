package com.example.hospin.controller;

import com.example.hospin.dto.AiRecommendRequest;
import com.example.hospin.dto.AiRecommendResponse;
import com.example.hospin.service.AiRecommendService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/ai")
public class AiRecommendController {

    private final AiRecommendService aiRecommendService;

    @Operation(summary = "AI 진료과 추천", description = "입력된 증상 리스트를 기반으로 적합한 진료과를 추천합니다.")
    @PostMapping("/recommend")
    public ResponseEntity<AiRecommendResponse> recommend(@RequestBody AiRecommendRequest request) {
        return ResponseEntity.ok(aiRecommendService.recommendDepartment(request));
    }
}