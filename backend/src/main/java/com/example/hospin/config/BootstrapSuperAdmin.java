package com.example.hospin.config;

import com.example.hospin.domain.entity.User;
import com.example.hospin.domain.entity.UserRole;
import com.example.hospin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class BootstrapSuperAdmin {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.super-admin.email}")
    private String superAdminEmail;

    @Value("${app.super-admin.password}")
    private String superAdminPassword;

    @Value("${app.super-admin.username}")
    private String superAdminUsername;

    @Bean
    public CommandLineRunner initSuperAdmin() {
        return args -> {
            if (userRepository.findByEmail(superAdminEmail).isEmpty()) {
                User admin = new User();
                admin.setEmail(superAdminEmail);
                admin.setPassword(passwordEncoder.encode(superAdminPassword));
                admin.setUsername(superAdminUsername);
                admin.setRole(UserRole.SUPER_ADMIN);
                userRepository.save(admin);
                System.out.println("✅ 기본 SUPER_ADMIN 계정 생성 완료: " + superAdminEmail);
            } else {
                System.out.println("🌟 SUPER_ADMIN 계정 이미 존재: " + superAdminEmail);
            }
        };
    }
}