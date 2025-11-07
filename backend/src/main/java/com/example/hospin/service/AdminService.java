package com.example.hospin.service;

import com.example.hospin.domain.entity.User;
import com.example.hospin.domain.entity.UserRole;
import com.example.hospin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final UserRepository userRepository;

    /** ✅ 관리자 승인 */
    @Transactional
    public void approve(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음: " + userId));
        u.setRole(UserRole.ADMIN_APPROVED);
    }

    /** ✅ 관리자 거절(보류 유지) */
    @Transactional
    public void reject(Long userId) {
        User u = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자 없음: " + userId));
        u.setRole(UserRole.ADMIN_PENDING);
    }

    /** ✅ 대기중인 관리자 조회 */
    @Transactional(readOnly = true)
    public List<User> listPending() {
        return userRepository.findAll().stream()
                .filter(u -> u.getRole() != null && u.getRole().equals(UserRole.ADMIN_PENDING))
                .toList();
    }
}