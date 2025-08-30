package com.example.hospin.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .securityMatcher("/**") // 모든 경로에 대해 보안 설정 적용
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/auth/**", "/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .anyRequest().permitAll() // 테스트 단계에선 전체 허용
                )
                .csrf(csrf -> csrf.disable()); // CSRF 보호 비활성화 (API 서버용)

        return http.build();
    }
}
