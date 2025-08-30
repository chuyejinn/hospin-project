package com.example.hospin.controller;

import com.example.hospin.dto.LoginRequest;
import com.example.hospin.dto.LoginResponse;
import com.example.hospin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // 🔹 DTO에서 email/password 꺼내서 Service 호출
            LoginResponse response = userService.login(
                    request.getEmail(),
                    request.getPassword()
            );

            return ResponseEntity.ok(response); // ✅ 성공 시 200 OK

        } catch (RuntimeException e) {
            // 🔹 에러 메시지에 따라 상태 코드 분기
            if (e.getMessage().contains("비밀번호")) {
                return ResponseEntity.status(401).body(e.getMessage()); // Unauthorized
            } else if (e.getMessage().contains("사용자를")) {
                return ResponseEntity.status(404).body(e.getMessage()); // Not Found
            }
            return ResponseEntity.status(400).body(e.getMessage()); // Bad Request
        }

    }
    @PostMapping("/api/users/logout")
    public ResponseEntity<?> logout() {
        // 실제로 서버에서 할 일 없음 (JWT라서 상태를 서버가 안 가짐)
        return ResponseEntity.ok("Logout successful");
    }
}