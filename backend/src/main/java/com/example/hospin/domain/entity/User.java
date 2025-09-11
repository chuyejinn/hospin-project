package com.example.hospin.domain.entity;

import jakarta.persistence.*;
import lombok.Getter;

import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Getter
    private Long id;

    @Column(name = "name") // DB의 name 컬럼과 매핑
    private String username;
    private String password;
    private String email;
    private String gender;
    private LocalDate birthdate;

    @Enumerated(EnumType.STRING) // enum → 문자열 저장
    private UserRole role;

    // ✅ 기본 생성자
    public User() {}

    // ✅ Getter/Setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUsername() { return username; }
    public void setUsername(String name) { this.username = name; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public LocalDate getBirthdate() { return birthdate; }
    public void setBirthdate(LocalDate birthdate) { this.birthdate = birthdate; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) { this.role = role; }
}