package com.example.hospin.controller;

import com.example.hospin.dto.UserResponseDto;
import com.example.hospin.service.AdminUserService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/users")
public class AdminUserController {

    private final AdminUserService adminUserService;

    /** ✅ 환자 검색 (이름, 이메일, 전화번호) */
    @Operation(summary = "환자 검색", description = "이름, 이메일, 전화번호 일부로 환자를 검색합니다.")
    @GetMapping("/search")
    public ResponseEntity<List<UserResponseDto>> searchUsers(@RequestParam String keyword) {
        return ResponseEntity.ok(adminUserService.searchUsers(keyword));
    }
}