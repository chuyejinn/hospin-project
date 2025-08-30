-- 진료 기록 테이블
CREATE TABLE medical_records (
                                 id BIGINT AUTO_INCREMENT PRIMARY KEY,
                                 userid BIGINT NOT NULL,
                                 department VARCHAR(50),        -- 진료과
                                 treatment_name VARCHAR(100),   -- 진료 내용 (ex: 레진)
                                 doctor_name VARCHAR(50),       -- 의료진명
                                 treatment_date DATE,           -- 진료일
                                 treatment_fee INT              -- 진료비
);