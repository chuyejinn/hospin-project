package com.example.hospin.controller;

import com.example.hospin.dto.LoginRequest;
import com.example.hospin.dto.SignupRequest;
import com.example.hospin.dto.LoginResponse;
import com.example.hospin.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthService authService;

    /** ✅ 회원가입 */
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            authService.signup(request);

            String message;
            switch (request.getRole().name().toUpperCase()) {
                case "ADMIN_PENDING":
                    message = "관리자 회원가입 완료 (현재 승인 대기 상태입니다.)";
                    break;
                case "SUPER_ADMIN":
                    message = "슈퍼관리자 계정이 생성되었습니다.";
                    break;
                default:
                    message = "일반 회원가입이 완료되었습니다.";
            }

            return ResponseEntity.ok(Map.of("message", message));

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));

        } catch (Exception e) {
            e.printStackTrace(); // 서버 콘솔에 전체 스택 출력
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "회원가입 중 오류 발생: " + e.getClass().getSimpleName() + " - " + e.getMessage()));
        }
    }

    /** ✅ 로그인 */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", e.getMessage()));

        } catch (IllegalStateException e) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message", e.getMessage()));

        } catch (Exception e) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "로그인 중 오류 발생: " + e.getMessage()));
        }
    }

    /** ✅ 로그아웃 (JWT 무상태) */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "로그아웃 완료 (JWT 무상태)"));
    }
}