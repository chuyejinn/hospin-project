package com.example.hospin.dto;

import com.example.hospin.domain.entity.UserRole;

public class SignupRequest {
    private String email;
    private String password;
    private String username;
    private String gender;
    private String birthdate;
    private UserRole role;


    public SignupRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBirthdate() { return birthdate; }
    public void setBirthdate(String birthdate) { this.birthdate = birthdate; }

    public UserRole getRole() { return role; }
    public void setRole(UserRole role) {
        this.role = role;
    }

}