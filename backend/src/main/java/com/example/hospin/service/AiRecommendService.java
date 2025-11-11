package com.example.hospin.service;

import com.example.hospin.dto.AiRecommendRequest;
import com.example.hospin.dto.AiRecommendResponse;
import org.springframework.stereotype.Service;

@Service
public class AiRecommendService {

    public AiRecommendResponse recommendDepartment(AiRecommendRequest request) {
        String symptom = request.getSymptom().toLowerCase();

        String department;
        String reason;

        // ✅ 보존과: 충치, 통증, 신경치료
        if (symptom.contains("충치") || symptom.contains("통증") || symptom.contains("시림") || symptom.contains("신경")) {
            department = "보존과";
            reason = "충치나 시림, 신경 통증 등의 문제는 보존과에서 진료합니다.";

            // ✅ 교정과: 치아 배열, 교정기, 덧니
        } else if (symptom.contains("교정") || symptom.contains("덧니") || symptom.contains("치아 배열") || symptom.contains("틀어짐")) {
            department = "교정과";
            reason = "치아 배열 이상이나 교정 관련 문제는 교정과에서 진료합니다.";

            // ✅ 보철과: 임플란트, 크라운, 브릿지
        } else if (symptom.contains("임플란트") || symptom.contains("크라운") || symptom.contains("브릿지") || symptom.contains("틀니")) {
            department = "보철과";
            reason = "손상된 치아 보철, 임플란트나 크라운은 보철과에서 치료합니다.";

            // ✅ 치주과: 잇몸, 출혈, 스케일링
        } else if (symptom.contains("잇몸") || symptom.contains("출혈") || symptom.contains("스케일링") || symptom.contains("풍치")) {
            department = "치주과";
            reason = "잇몸 염증, 출혈, 풍치 등은 치주과 진료가 적합합니다.";

            // ✅ 기본값: 내원 권장
        } else {
            department = "치과 종합 진료";
            reason = "입안 통증, 불편감 등은 증상에 따라 여러 진료과 협진이 필요할 수 있습니다.";
        }

        return new AiRecommendResponse(department, reason);
    }
}