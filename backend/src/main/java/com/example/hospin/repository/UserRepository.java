package com.example.hospin.repository;

import com.example.hospin.domain.entity.User;
import com.example.hospin.domain.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsernameAndPhone(String username, String phone);
    Optional<User> findByEmail(String email);

    /** ✅ 이름, 이메일, 전화번호 일부 검색 */
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<User> findByKeyword(@Param("keyword") String keyword);

    List<User> findByRole(UserRole role);
}



