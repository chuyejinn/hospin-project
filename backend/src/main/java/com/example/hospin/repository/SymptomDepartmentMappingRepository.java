package com.example.hospin.repository;

import com.example.hospin.domain.entity.SymptomDepartmentMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SymptomDepartmentMappingRepository extends JpaRepository<SymptomDepartmentMapping, Long> {
    List<SymptomDepartmentMapping> findBySymptomContaining(String symptom);
}