package com.example.hospin.service;

import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.LoginRequest;
import com.example.hospin.dto.LoginResponse;
import com.example.hospin.dto.SignupRequest;
import com.example.hospin.repository.UserRepository;
import com.example.hospin.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
@RequiredArgsConstructor
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();


    public void signup(SignupRequest request) {
        User user = new User();

        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getName());
        user.setGender(request.getGender());

        // ✅ 생년월일이 null이 아니고, 올바른 형식일 때만 LocalDate로 변환
        if (request.getBirthdate() != null && !request.getBirthdate().isBlank()) {
            try {
                user.setBirthdate(LocalDate.parse(request.getBirthdate()));  // "yyyy-MM-dd" 형식이어야 함
            } catch (DateTimeParseException e) {
                throw new RuntimeException("생년월일 형식이 올바르지 않습니다. yyyy-MM-dd 형식이어야 합니다.");
            }
        } else {
            throw new RuntimeException("생년월일은 필수 항목입니다.");
        }

        user.setRole(request.getRole());

        userRepository.save(user);
    }

    public LoginResponse login(LoginRequest request) {
        // 이메일로 유저 조회
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("존재하지 않는 사용자입니다."));

        // 비밀번호 확인
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다.");
        }

        // JWT 토큰 생성
        String token = jwtUtil.generateToken(user); // 이 메서드는 User 정보 기반으로 토큰 생성해야 함

        // 로그인 응답 객체 반환
        return new LoginResponse(
                user.getId(),
                user.getUsername(),
                user.getRole(),
                token
        );
    }
}