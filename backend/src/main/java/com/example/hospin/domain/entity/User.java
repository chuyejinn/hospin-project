package com.example.hospin.domain.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;

import java.time.LocalDate;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String username;  // ✅ 사용자 아이디
    private String password;  // ✅ 사용자 비밀번호
    private String email;
    private String gender;
    private LocalDate birthdate;
    @Getter
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

    public void setGender(String gender) {
    }
    public void setBirthdate(LocalDate parse) {
    }

    public void setRole(UserRole role) {
    }

}