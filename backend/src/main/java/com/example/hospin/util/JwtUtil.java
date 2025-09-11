package com.example.hospin.util;

import com.example.hospin.domain.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtil {

    private final String secretKey = "mySuperSecretKey"; // 👉 실제로는 환경변수로 분리하는 게 좋음
    private final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24시간

    // ✅ 토큰 생성: User 객체 기반
    public String generateToken(User user) {
        return Jwts.builder()
                .setSubject(user.getEmail()) // 주제: 이메일
                .claim("id", user.getId()) // 사용자 ID
                .claim("role", user.getRole()) // 사용자 역할 (String)
                .setIssuedAt(new Date()) // 발급 시간
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME)) // 만료 시간
                .signWith(SignatureAlgorithm.HS512, secretKey) // 서명
                .compact();
    }

    // ✅ 토큰에서 이메일 추출
    public String extractEmail(String token) {
        return getClaims(token).getSubject();
    }

    // ✅ 토큰에서 role 추출
    public String extractRole(String token) {
        return (String) getClaims(token).get("role");
    }

    // ✅ 토큰 유효성 검사
    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    // ✅ Claims 추출
    private Claims getClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }
}