package com.example.hospin.dto;

import com.example.hospin.domain.entity.UserRole;

public class SignupRequest {
    private String email;
    private String password;
    private String name;
    private String gender;
    private String birthdate;
    private UserRole role;


    public SignupRequest() {}

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBirthdate() { return birthdate; }
    public void setBirthdate(String birthdate) { this.birthdate = birthdate; }

    public UserRole getRole() { return role; }
    public UserRole setRole(UserRole role) { this.role = role;
        return role;
    }
}