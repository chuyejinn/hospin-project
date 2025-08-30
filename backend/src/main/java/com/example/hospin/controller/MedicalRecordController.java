package com.example.hospin.controller;

import com.example.hospin.service.MedicalRecordService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/medical-records")
public class MedicalRecordController {

    private final MedicalRecordService medicalRecordService;

    public MedicalRecordController(MedicalRecordService medicalRecordService) {
        this.medicalRecordService = medicalRecordService;
    }

    // 여기에 기존 API 메서드들 그대로 유지
}