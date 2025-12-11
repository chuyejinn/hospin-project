package com.example.hospin.controller;

import com.example.hospin.service.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /** ✅ 관리자 승인 */
    @Operation(summary = "관리자 승인", description = "특정 관리자 계정을 승인합니다.")
    @PutMapping("/approve/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<String> approve(@PathVariable Long userId) {
        adminService.approve(userId);
        return ResponseEntity.ok("승인 완료: " + userId);
    }

    /** ✅ 관리자 거절 */
    @Operation(summary = "관리자 거절", description = "특정 관리자 계정을 거절(보류) 처리합니다.")
    @PutMapping("/reject/{userId}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<String> reject(@PathVariable Long userId) {
        adminService.reject(userId);
        return ResponseEntity.ok("거절(보류) 처리: " + userId);
    }

    /** ✅ 대기중 관리자 목록 */
    @Operation(summary = "승인 대기 관리자 목록", description = "ADMIN_PENDING 상태의 관리자를 조회합니다.")
    @GetMapping("/pending")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<List<Map<String, Object>>> pending() {
        List<Map<String, Object>> list = adminService.listPending().stream()
                .map(u -> Map.<String, Object>of(
                        "id", u.getId(),
                        "email", u.getEmail(),
                        "username", u.getUsername()
                ))
                .collect(Collectors.toList());
        return ResponseEntity.ok(list);
    }
}