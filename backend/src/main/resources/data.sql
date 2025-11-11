-- ✅ user 테이블 데이터 삽입
INSERT INTO `user` (id, email, password, role, birthdate, gender, username)
VALUES (1, 'testuser@example.com', 'encoded_password_here', 'PATIENT', '2000-01-01', 'MALE', '테스트유저');

-- ✅ department 테이블
INSERT INTO department (name, image_url) VALUES
                                             ('보존과', '/images/department/conservation.png'),
                                             ('교정과', '/images/department/orthodontics.png'),
                                             ('보철과', '/images/department/prosthodontics.png'),
                                             ('치주과', '/images/department/periodontology.png');

-- ✅ medical_record 테이블 삽입 (테이블명 단수형 확인!)
INSERT INTO medical_record (user_id, department, diagnosis, visit_date, treatment_fee)
VALUES
    (1, '보존과', '레진 치료', '2023-02-18', 50000),
    (1, '보존과', '레진 치료', '2023-02-26', 50000),
    (1, '보존과', '레진 치료', '2024-01-05', 50000),
    (1, '보존과', '레진 치료', '2024-01-20', 50000)