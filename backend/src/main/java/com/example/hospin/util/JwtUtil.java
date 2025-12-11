package com.example.hospin.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    // ✅ HS512용 충분히 긴 키 (64바이트 이상)
    private static final String SECRET_KEY = "hospin-super-secure-jwt-secret-key-for-production-2025-hospin-project!!";

    // JWT 유효기간: 24시간
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24;

    // ✅ 실제로 Key 객체를 생성해서 사용
    private final Key key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes());

    // 토큰 생성
    public String generateToken(String email, String role) {
        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    // 이메일 추출
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    // 역할(role) 추출
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }

    // JWT Claims 파싱
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}