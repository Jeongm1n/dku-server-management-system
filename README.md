# dku-server-management-system
 단국대학교 머신러닝 서버 통합 관리시스템 (DKU-SMS)
 
 발주/단국대학교 SW중심대학사업단

 [사용법 핸드북](https://www.notion.so/DKU-SMS-Handbook-07303724c9b84c8dbdee8368a631846f)(Notion)

### 프로젝트 목적

- 단국대학교 Machine Learning 서버 통합 관리, 예약 시스템 구축
- 학과 교수의 계정으로 교내 머신러닝 서버를 일정 기간동안 예약할 수 있음
- 서버 관리자는 실시간으로 머신러닝 서버의 상태와 예약 현황을 일괄적으로 조회할 수 있음

### 프로젝트 팀원

- 허전진 (소프트웨어학과) - 프로젝트 총괄
- 조정민 (소프트웨어학과) - 프론트엔드 / 벡엔드
- 최지윤 (소프트웨어학과) - 데이터베이스

### 기술 스택

- 벡엔드
    - Node.js, Express, GraphQL, SSH2, PM2, Sequelize
- 프론트엔드
    - React, Apollo, Material UI, HTML5/CSS5/JS
- 데이터베이스
    - Redis, MySQL
- 서버 인프라
    - Docker

### 프로그램 로직

1. 교수자가 웹 페이지에서 일정 기간 서버 예약 신청 → 관리자 승인
    - 관리자 승인 후 예약 승인 문서(PDF) 발급
2. 교수자가 신청 기간동안 사용 후 반납 신청 → 관리자 승인
    - 반납시 교수자 확인 내용 토대로 반납 신청 문서(PDF) 발급

- 관리자는 모든 서버의 예약 현황, 가동 상태를 관리자 전용 페이지에서 볼 수 있음
- 반납시 초기 서버의 상태로 원복하지 않거나 서버에 문제가 발생하면 승인 거부 후 페널티 부여
- 신청 기간은 1일 단위 (00시 ~ 24시)
