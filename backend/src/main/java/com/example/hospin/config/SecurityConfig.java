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
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/",                      // 홈
                                "/auth/**",               // 인증 관련
                                "/swagger-ui.html",       // Swagger 메인
                                "/swagger-ui/**",         // Swagger UI 리소스
                                "/v3/api-docs/**",        // OpenAPI JSON
                                "/v3/api-docs",
                                "/swagger-resources/**",  // Swagger 리소스
                                "/webjars/**"             // Swagger JS
                        ).permitAll()
                        .anyRequest().permitAll() // 일단 전체 허용
                )
                .csrf(csrf -> csrf.disable());

        return http.build();
    }
}
