package com.example.hospin.service;

import com.example.hospin.domain.entity.Department;
import com.example.hospin.dto.AiRecommendRequest;
import com.example.hospin.dto.AiRecommendResponse;
import com.example.hospin.repository.DepartmentRepository;
import com.example.hospin.repository.SymptomDepartmentMappingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiRecommendService {

    private final DepartmentRepository departmentRepository;
    private final SymptomDepartmentMappingRepository mappingRepository;

    public AiRecommendResponse recommendDepartment(AiRecommendRequest request) {
        if (request == null || request.getSymptoms() == null || request.getSymptoms().isEmpty()) {
            return new AiRecommendResponse("증상이 입력되지 않았습니다.", null);
        }

        Map<Long, Integer> countMap = new HashMap<>();

        for (String symptom : request.getSymptoms()) {
            mappingRepository.findBySymptomContaining(symptom)
                    .forEach(mapping -> {
                        Long deptId = mapping.getDepartment().getId();
                        countMap.put(deptId, countMap.getOrDefault(deptId, 0) + 1);
                    });
        }

        if (countMap.isEmpty()) {
            return new AiRecommendResponse("추천 가능한 진료과를 찾을 수 없습니다.", null);
        }

        Long bestDeptId = Collections.max(countMap.entrySet(), Map.Entry.comparingByValue()).getKey();
        Department bestDept = departmentRepository.findById(bestDeptId).orElse(null);

        String departmentName = bestDept != null ? bestDept.getName() : "알 수 없음";
        return new AiRecommendResponse("추천된 진료과: " + departmentName, departmentName);
    }
}