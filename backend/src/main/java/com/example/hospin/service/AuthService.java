package com.example.hospin.service;

import com.example.hospin.domain.entity.Gender;
import com.example.hospin.domain.entity.User;
import com.example.hospin.domain.entity.UserRole;
import com.example.hospin.dto.LoginRequest;
import com.example.hospin.dto.LoginResponse;
import com.example.hospin.dto.SignupRequest;
import com.example.hospin.repository.UserRepository;
import com.example.hospin.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    @SuppressWarnings("unused")
    private final AuthenticationManager authenticationManager;

    /** ✅ 회원가입 */
    public void signup(SignupRequest request) {

        System.out.println("📥 Signup Request: " + request.getEmail() + ", "
                + request.getGender() + ", "
                + request.getBirthdate() + ", "
                + request.getRole());

        // 이메일 중복 체크
        userRepository.findByEmail(request.getEmail()).ifPresent(u -> {
            throw new IllegalArgumentException("이미 존재하는 이메일입니다.");
        });

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setGender(Gender.valueOf(request.getGender().toUpperCase()));
        user.setBirthdate(LocalDate.parse(request.getBirthdate()));

        // ✅ 프론트에서 전달한 role 그대로 반영
        // (일반 환자 = PATIENT, 관리자 = ADMIN_PENDING)
        UserRole role = request.getRole();
        if (role == null) {
            role = UserRole.PATIENT; // 기본값 안전 처리
        }
        user.setRole(role);

        // ✅ 관리자 승인 상태 기본 false
        user.setAdminApproved(false);

        userRepository.save(user);
    }

    /** ✅ 로그인 */
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("가입되지 않은 이메일입니다."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("비밀번호가 일치하지 않습니다.");
        }

        // ✅ 관리자 승인 전 로그인 차단
        if (user.getRole() == UserRole.ADMIN_PENDING) {
            throw new IllegalStateException("관리자 승인이 완료되지 않았습니다. 승인 후 로그인 가능합니다.");
        }


        // ✅ JWT 생성 시 ROLE_ prefix 추가
        String token = jwtUtil.generateToken(user.getEmail(), "ROLE_" + user.getRole().name());

        // ✅ LoginResponse 반환
        return new LoginResponse(
                user.getId(),
                user.getEmail(),
                user.getUsername(),
                user.getRole().name(),
                token
        );
    }
}