package com.example.hospin.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/")
    public String home() {
        return "🟢 HOSPIN 서버 정상 작동 중입니다!";
    }
}