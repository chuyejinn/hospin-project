package com.example.hospin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // ✅ Swagger, 프론트엔드, 로컬 전부 허용
                .allowedOriginPatterns("*")
                // ✅ 모든 메서드 허용
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                // ✅ 모든 헤더 허용
                .allowedHeaders("*")
                // ✅ Swagger랑 프론트 전부 쿠키 인증 가능
                .allowCredentials(false) // 🚨 여기 false로 바꾸기
                .maxAge(3600);
    }
}