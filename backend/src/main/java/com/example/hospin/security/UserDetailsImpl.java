package com.example.hospin.security;

import com.example.hospin.domain.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;

@Getter
public class UserDetailsImpl implements UserDetails {

    private final User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    // ✅ 사용자 권한 반환
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList(); // 권한 없음
    }

    // ✅ 사용자 비밀번호
    @Override
    public String getPassword() {
        return user.getPassword(); // User 엔티티에 getPassword() 있어야 함
    }

    // ✅ 사용자 아이디
    @Override
    public String getUsername() {
        return user.getUsername(); // User 엔티티에 getUsername() 있어야 함
    }

    // ✅ 계정 만료 여부
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    // ✅ 계정 잠김 여부
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    // ✅ 자격 증명(비밀번호 등) 만료 여부
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    // ✅ 계정 활성화 여부
    @Override
    public boolean isEnabled() {
        return true;
    }
}