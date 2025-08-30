package com.example.hospin.controller;

import com.example.hospin.dto.LoginRequest;
import com.example.hospin.dto.SignupRequest;
import com.example.hospin.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    // Lombok @RequiredArgsConstructor 대신 직접 생성자 작성
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody SignupRequest request) {
        authService.signup(request);
        return ResponseEntity.ok("회원가입 성공");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}