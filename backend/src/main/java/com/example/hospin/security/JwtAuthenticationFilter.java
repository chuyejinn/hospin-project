package com.example.hospin.security;

import com.example.hospin.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        //  인증 제외 경로 처리 (/auth/**는 필터 통과)
        String path = request.getRequestURI();
        if (path.startsWith("/auth")) {
            filterChain.doFilter(request, response);
            return;
        }

        //  Authorization 헤더에서 토큰 추출
        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            //  JWT 유효성 검증
            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractEmail(token);
                String role = jwtUtil.extractRole(token); // ✅ role 추출 ("DOCTOR" 등)

                //  사용자 정보 로드
                UserDetailsImpl userDetails =
                        (UserDetailsImpl) userDetailsService.loadUserByUsername(username);

                SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role);

                // ✅ SecurityContext에 인증정보 설정
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                Collections.singletonList(authority)
                        );

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authentication);

                System.out.println("✅ SecurityContext 권한: " + SecurityContextHolder.getContext().getAuthentication().getAuthorities());

                // ✅ 디버그 로그 (확인용)
                System.out.println("✅ JwtAuthenticationFilter 통과됨");
                System.out.println(" - username: " + username);
                System.out.println(" - role: ROLE_" + role);
            }
        }

        // ✅ 필터 체인 계속 진행
        filterChain.doFilter(request, response);
    }
}