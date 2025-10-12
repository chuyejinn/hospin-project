package com.example.hospin.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String password;

    private String username;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private LocalDate birthdate;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    // 필요 시 생성자 추가
    public User(String email, String password, String username, Gender gender, LocalDate birthdate, UserRole role) {
        this.email = email;
        this.password = password;
        this.username = username;
        this.gender = gender;
        this.birthdate = birthdate;
        this.role = role;
    }
}