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
