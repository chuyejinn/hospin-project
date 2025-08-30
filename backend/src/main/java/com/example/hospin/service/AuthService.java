package com.example.hospin.service;

import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.LoginRequest;
import com.example.hospin.dto.LoginResponse;
import com.example.hospin.dto.SignupRequest;
import com.example.hospin.repository.UserRepository;
import com.example.hospin.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public void signup(SignupRequest request) {
        // 회원가입 로직
    }

    public LoginResponse login(LoginRequest request) {
        // 로그인 로직
        return null;
    }
}