# 🏥 HOSPIN - 병원 웹 서비스 플랫폼

AI 기반 진료과 추천 및 병원 예약 관리 웹 서비스

사용자의 증상을 기반으로 적절한 진료과를 추천하고  
병원 예약 및 진료 기록을 관리할 수 있도록 구현한  
의료 서비스 플랫폼 프로젝트입니다.

Spring Boot 기반 REST API 서버를 구축하고  
JWT 인증 시스템과 예약 및 진료 기록 관리 기능을 구현했습니다.

---

## 📌 Project Background

병원 이용 시 많은 사용자가  
"어떤 진료과를 방문해야 하는지" 혼란을 겪는 경우가 많습니다.

이 문제를 해결하기 위해  
사용자의 증상 정보를 기반으로 적절한 진료과를 추천하고  
예약 및 진료 기록 관리를 제공하는 의료 서비스 플랫폼을  
웹 서비스 형태로 구현했습니다.

---

## 🚀 Main Features

### 👤 사용자 인증
- 회원가입 / 로그인 기능
- JWT 기반 인증 및 인가 처리
- Spring Security 기반 인증 필터 적용

### 🩺 진료과 추천
- 사용자 증상 기반 진료과 추천 기능 제공

### 📅 예약 시스템
- 진료과 및 의사 선택
- 병원 예약 생성
- 예약 조회 기능

### 📋 진료 기록 관리
- 환자 진료 기록 조회
- 진료 기록 상세 조회

### 🔎 공통 API
- 진료과 목록 조회
- 진료과별 의사 조회

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security
- JPA (Hibernate)

### Database
- MySQL (AWS RDS)

### Infrastructure
- AWS EC2
- AWS RDS

### API Documentation
- Swagger

### Authentication
- JWT (JSON Web Token)

---

## 🏗 System Architecture

HOSPIN 시스템은 웹 클라이언트와 Spring Boot 기반 백엔드 서버로 구성된  
RESTful 아키텍처 구조로 설계되었습니다.

사용자의 요청은 REST API를 통해 서버로 전달되며  
Spring Boot 애플리케이션이 비즈니스 로직을 처리한 뒤  
MySQL 데이터베이스와 연동하여 데이터를 관리합니다.

또한 인증 및 권한 관리를 위해  
JWT 기반 인증 시스템을 적용했습니다.

### Architecture Overview

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

---

## 🧩 Backend Architecture

백엔드는 **Layered Architecture 구조**로 설계되었습니다.

각 계층은 다음과 같은 역할을 수행합니다.

| Layer | Description |
|------|-------------|
| Controller | HTTP 요청 처리 및 API 엔드포인트 제공 |
| Service | 비즈니스 로직 처리 |
| Repository | 데이터베이스 접근 (JPA) |
| Entity | 데이터베이스 테이블과 매핑되는 객체 |
| DTO | API 요청 및 응답 데이터 전달 객체 |
| Security | JWT 기반 인증 및 권한 관리 |

### Backend Layer Structure

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

---

## 🔐 Authentication Flow

사용자 인증은 **JWT(JSON Web Token)** 기반으로 구현되었습니다.

인증 과정은 다음과 같습니다.

1. 사용자가 로그인 요청을 보냅니다.  
2. 서버는 사용자 정보를 검증합니다.  
3. 인증 성공 시 JWT 토큰을 발급합니다.  
4. 클라이언트는 이후 요청 시 Authorization Header에 JWT 토큰을 포함합니다.  
5. JwtAuthenticationFilter에서 토큰을 검증합니다.

Authentication Flow

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

---

## 🗄 Database ERD

주요 테이블 구조

- User  
- Department  
- Doctor  
- Reservation  
- MedicalRecord  

📌 ERD 다이어그램  
(ERD 이미지 추가 예정)

---

## ☁ Deployment Architecture

HOSPIN 백엔드는 AWS 클라우드 환경에서 배포되었습니다.

| Component | Description |
|-----------|-------------|
| EC2 | Spring Boot 애플리케이션 서버 |
| RDS | MySQL 데이터베이스 |
| GitHub | 소스 코드 관리 |
| Swagger | API 문서 테스트 |

Deployment Structure

User  
│  
▼  
AWS EC2 (Spring Boot Server)  
│  
▼  
AWS RDS (MySQL Database)

---

## 📡 API Example

### Login

POST /api/auth/login

### Request

```json
{
  "email": "user@test.com",
  "password": "1234"
}
### Response

```json
{
  "accessToken": "JWT_TOKEN",
  "tokenType": "Bearer"
}
```

---

## 📑 API Endpoints Overview

HOSPIN 시스템은 다음과 같은 주요 REST API를 제공합니다.

### Auth API

| Method | Endpoint | Description |
|------|------|-------------|
| POST | /api/auth/signup | 사용자 회원가입 |
| POST | /api/auth/login | 사용자 로그인 |

### Reservation API

| Method | Endpoint | Description |
|------|------|-------------|
| POST | /api/reservations | 예약 생성 |
| GET | /api/reservations | 예약 목록 조회 |
| GET | /api/reservations/{id} | 예약 상세 조회 |

### Medical Record API

| Method | Endpoint | Description |
|------|------|-------------|
| GET | /api/records | 진료 기록 목록 조회 |
| GET | /api/records/{recordId} | 진료 기록 상세 조회 |

### Common API

| Method | Endpoint | Description |
|------|------|-------------|
| GET | /common/departments | 진료과 목록 조회 |
| GET | /common/doctors | 진료과별 의사 조회 |

---

## 🧪 API Testing

API 테스트는 **Swagger UI**를 통해 확인할 수 있습니다.

Swagger URL

```
http://<EC2-IP>:8080/swagger-ui/index.html
```

예시

```
http://3.38.239.246:8080/swagger-ui/index.html
```

Swagger를 통해 다음 기능을 테스트할 수 있습니다.

- 회원가입 / 로그인
- JWT 인증 테스트
- 진료과 조회
- 의사 조회
- 예약 생성
- 진료 기록 조회

---

## 📂 Project Structure

```
src
 └── main
     └── java
         └── com.example.hospin
             ├── controller
             │     ├── AuthController
             │     ├── ReservationController
             │     ├── MedicalRecordController
             │     └── CommonController
             │
             ├── service
             │     ├── AuthService
             │     ├── ReservationService
             │     ├── MedicalRecordService
             │     └── DepartmentService
             │
             ├── repository
             │     ├── UserRepository
             │     ├── ReservationRepository
             │     ├── MedicalRecordRepository
             │     └── DepartmentRepository
             │
             ├── entity
             │     ├── User
             │     ├── Department
             │     ├── Doctor
             │     ├── Reservation
             │     └── MedicalRecord
             │
             ├── dto
             │     ├── LoginRequestDto
             │     ├── SignupRequestDto
             │     └── ReservationRequestDto
             │
             └── security
                   ├── JwtTokenProvider
                   ├── JwtAuthenticationFilter
                   └── SecurityConfig
```

---

## ⚙️ Getting Started

### 1️⃣ Clone Repository

```
git clone https://github.com/<your-github-id>/hospin.git
```

### 2️⃣ Build Project

```
./gradlew build
```

또는

```
gradle build
```

### 3️⃣ Run Application

```
java -jar build/libs/hospin-0.0.1-SNAPSHOT.jar
```

---

## 🔑 Environment Configuration

application.yml 또는 application.properties에서 다음 설정이 필요합니다.

### Database

```
spring.datasource.url=jdbc:mysql://<RDS-ENDPOINT>:3306/hospin_db
spring.datasource.username=DB_USERNAME
spring.datasource.password=DB_PASSWORD
```

### JWT

```
jwt.secret=your-secret-key
jwt.expiration=86400000
```

---

## 🚧 Future Improvements

다음과 같은 기능을 추가적으로 개선할 계획입니다.

- AI 기반 진료과 추천 알고리즘 고도화
- 예약 취소 및 변경 기능 추가
- 의료 기록 작성 기능
- 알림 기능 (예약 알림)
- Docker 기반 컨테이너 배포
- CI/CD 자동 배포 파이프라인 구축

---

## 👩‍💻 Author

**추예진 (Chuyejin Chu)**  
Backend Developer

- GitHub : https://github.com/<your-github-id>
- Email : your-email@example.com

---

## 📜 License

This project is licensed under the MIT License.
