package com.example.hospin.domain.entity;

public enum UserRole {
    PATIENT,          // 일반 환자
    ADMIN_PENDING,    // 관리자 (승인 대기)
    ADMIN_APPROVED,   // 관리자 (승인 완료)
    SUPER_ADMIN       // 슈퍼 관리자 (최고 권한)
}