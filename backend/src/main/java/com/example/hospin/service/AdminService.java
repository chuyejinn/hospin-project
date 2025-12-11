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

    /** ✅ 관리자 승인 대기 목록 조회 */
    public List<User> listPending() {
        // ADMIN_PENDING인 사용자만 조회
        return userRepository.findByRole(UserRole.ADMIN_PENDING);
    }

    /** ✅ 관리자 승인 처리 */
    @Transactional
    public void approve(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다."));
        user.setRole(UserRole.ADMIN_APPROVED);
        user.setAdminApproved(true);
        userRepository.save(user);
    }

    /** ✅ 관리자 거절 처리 (보류 상태 유지) */
    @Transactional
    public void reject(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("해당 사용자가 없습니다."));
        user.setRole(UserRole.ADMIN_PENDING); // 그대로 유지 (혹은 PATIENT로 변경 가능)
        user.setAdminApproved(false);
        userRepository.save(user);
    }
}