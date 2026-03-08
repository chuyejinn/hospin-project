🏥 HOSPIN - 병원 웹 서비스 플랫폼

AI 기반 진료과 추천 및 병원 예약 관리 웹 서비스

사용자의 증상을 기반으로 적절한 진료과를 추천하고
병원 예약 및 진료 기록을 관리할 수 있도록 구현한
의료 서비스 플랫폼 프로젝트입니다.

Spring Boot 기반 REST API 서버를 구축하고
JWT 인증 시스템과 예약 및 진료 기록 관리 기능을 구현했습니다.

⸻

Project Background

병원 이용 시 많은 사용자가
“어떤 진료과를 방문해야 하는지” 혼란을 겪는 경우가 많습니다.

이 문제를 해결하기 위해
사용자의 증상 정보를 기반으로 적절한 진료과를 추천하고
예약 및 진료 기록 관리를 제공하는 의료 서비스 플랫폼을
웹 서비스 형태로 구현했습니다.

⸻

Main Features

사용자 인증
	•	회원가입 / 로그인 기능
	•	JWT 기반 인증 및 인가 처리
	•	Spring Security 기반 인증 필터 적용

진료과 추천
	•	사용자 증상 기반 진료과 추천 기능 제공

예약 시스템
	•	진료과 및 의사 선택
	•	병원 예약 생성
	•	예약 조회 기능

진료 기록 관리
	•	환자 진료 기록 조회
	•	진료 기록 상세 조회

공통 API
	•	진료과 목록 조회
	•	진료과별 의사 조회

⸻

Tech Stack

Backend
	•	Java 17
	•	Spring Boot
	•	Spring Security
	•	JPA (Hibernate)

Database
	•	MySQL (AWS RDS)

Infrastructure
	•	AWS EC2
	•	AWS RDS

API Documentation
	•	Swagger

Authentication
	•	JWT (JSON Web Token)

⸻

System Architecture

HOSPIN 시스템은 웹 클라이언트와 Spring Boot 기반 백엔드 서버로 구성된
RESTful 아키텍처 구조로 설계되었습니다.

사용자의 요청은 REST API를 통해 서버로 전달되며
Spring Boot 애플리케이션이 비즈니스 로직을 처리한 뒤
MySQL 데이터베이스와 연동하여 데이터를 관리합니다.

또한 인증 및 권한 관리를 위해
JWT 기반 인증 시스템을 적용했습니다.

Architecture Overview 
Client (Web Browser)
        │
        ▼
Frontend (HTML / CSS / JavaScript)
        │
        ▼
Spring Boot REST API Server
        │
        ├── Spring Security
        ├── JWT Authentication
        ├── Business Logic (Service Layer)
        │
        ▼
MySQL Database (AWS RDS) 

⸻

Backend Architecture

백엔드는 Layered Architecture 구조로 설계되었습니다.

각 계층은 다음 역할을 수행합니다. 
Layer
Description
Controller
HTTP 요청 처리 및 API 엔드포인트 제공
Service
비즈니스 로직 처리
Repository
데이터베이스 접근 (JPA)
Entity
데이터베이스 테이블과 매핑되는 객체
DTO
API 요청 및 응답 데이터 전달 객체
Security
JWT 기반 인증 및 권한 관리
Backend Layer Structure
Controller
   │
   ▼
Service
   │
   ▼
Repository
   │
   ▼
Database

⸻

Authentication Flow

사용자 인증은 JWT(JSON Web Token) 기반으로 구현되었습니다.

인증 과정은 다음과 같습니다.
	1.	사용자가 로그인 요청을 보냅니다.
	2.	서버는 사용자 정보를 검증합니다.
	3.	인증 성공 시 JWT 토큰을 발급합니다.
	4.	클라이언트는 이후 요청 시 Authorization Header에 JWT 토큰을 포함합니다.
	5.	JwtAuthenticationFilter에서 토큰을 검증합니다.
  Client Login Request
        │
        ▼
Spring Security Authentication
        │
        ▼
JWT Token Issued
        │
        ▼
Client stores token
        │
        ▼
API Request with JWT
        │
        ▼
JwtAuthenticationFilter Validation

⸻

Database ERD

주요 테이블 구조
	•	User
	•	Department
	•	Doctor
	•	Reservation
	•	MedicalRecord

📌 ERD 다이어그램 
(ERD 이미지 추가 예정)

⸻

Deployment Architecture

HOSPIN 백엔드는 AWS 클라우드 환경에서 배포되었습니다.
Component
Description
EC2
Spring Boot 애플리케이션 서버
RDS
MySQL 데이터베이스
GitHub
소스 코드 관리
Swagger
API 문서 테스트
Deployment Structure
User
 │
 ▼
AWS EC2 (Spring Boot Server)
 │
 ▼
AWS RDS (MySQL Database)

⸻

API Example

Login

POST /api/auth/login

Request
{
  "email": "user@test.com",
  "password": "1234"
} 

⸻

API Documentation

Swagger를 통해 API 테스트 및 문서 확인이 가능합니다.

⸻

Future Improvements
	•	AI 기반 진료과 추천 로직 고도화
	•	예약 알림 기능 추가
	•	의료 기록 관리 기능 확장
