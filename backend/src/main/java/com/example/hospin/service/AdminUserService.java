package com.example.hospin.service;

import com.example.hospin.domain.entity.User;
import com.example.hospin.dto.UserResponseDto;
import com.example.hospin.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserService {

    private final UserRepository userRepository;

    /** ✅ 이름, 이메일, 전화번호 일부로 검색 */
    public List<UserResponseDto> searchUsers(String keyword) {
        log.info("🔍 [searchUsers] 검색어: {}", keyword);

        List<User> users = userRepository.findByKeyword(keyword);

        return users.stream()
                .map(UserResponseDto::new)
                .collect(Collectors.toList());
    }
}