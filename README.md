# SmartHire — Modern Dual-Database Recruitment Platform

[![Spring Boot 3.3.4](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 18](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![MySQL 8](https://img.shields.io/badge/MySQL-8.0-orange.svg)](https://www.mysql.com/)
[![MongoDB 7](https://img.shields.io/badge/MongoDB-7.0-green.svg)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**SmartHire** is a full-stack, enterprise-grade job recruitment portal built with a clean micro-service styled modular architecture. It leverages a **polyglot persistence (Dual-Database)** strategy combining **MySQL 8** (for transactional integrity, user authentication, job postings, and application lifecycles) and **MongoDB 7** (for candidate portfolio documents, resume metadata, search analytics, and audit logging).

This project was built to meet high-level engineering standards suitable for a BE Computer Engineering capstone, portfolio presentation, or commercial baseline.

---

## Table of Contents
1. [Key Features](#key-features)
2. [Architecture & System Design](#architecture--system-design)
3. [Technology Stack](#technology-stack)
4. [Dual-Database Architecture](#dual-database-architecture)
5. [Project Structure](#project-structure)
6. [Prerequisites](#prerequisites)
7. [Getting Started (Step-by-Step)](#getting-started-step-by-step)
   - [Database Setup (Docker or Native)](#1-database-setup)
   - [Backend Configuration & Execution](#2-backend-setup)
   - [Frontend Configuration & Execution](#3-frontend-setup)
8. [Demo Credentials](#demo-credentials)
9. [API Documentation (Swagger / OpenAPI)](#api-documentation)
10. [Academic Learning Component (SQL & MongoDB)](#academic-learning-component)
11. [Running Automated Tests](#running-automated-tests)
12. [Troubleshooting Guide](#troubleshooting-guide)
13. [GitHub Upload Instructions](#github-upload-instructions)

---

## Key Features

### For Candidates
- **Registration & Authentication**: Secure JWT-based registration and login with BCrypt password hashing.
- **Dynamic Job Search & Filters**: Search jobs by keyword, location, employment type (Full-time, Part-time, Remote, Contract, Internship), experience level, and salary.
- **One-Click Application**: Apply once per job with resume attachment and custom cover letter (duplicate application prevention enforced at both DB and API layers).
- **Application Tracking Stepper**: Visual multi-stage recruitment pipeline tracker (`APPLIED` → `REVIEWING` → `SHORTLISTED` → `INTERVIEWING` → `OFFERED` / `REJECTED`).
- **Comprehensive Profile**: Upload profile photos, maintain education, work experience, portfolio projects, certifications, and manage PDF resumes.
- **Saved Jobs**: Bookmark jobs to review and apply later.
- **Search History**: Track recent job queries with fast one-click replay.

### For Recruiters
- **Company Profile Management**: Create and manage company brand profile, website, industry, description, headquarters, and company logo upload.
- **Job Posting & Management**: Post new openings with salary ranges, skills tags, and requirements. Edit or close job listings.
- **Candidate Review Hub**: Inspect candidate relational applications and extended MongoDB portfolios (education, projects, certifications).
- **Secure Resume Downloads**: Stream candidate PDF resumes through authenticated, role-verified endpoints without exposing filesystem paths.
- **Status Updates**: Advance candidates through recruitment stages with instant UI feedback.
- **Interview Feedback System**: Record structured round-by-round interview notes, ratings (1–5), and evaluation topics in MongoDB.
- **Recruitment Analytics**: Visual pipeline breakdown charts powered by Recharts.

### For Administrators
- **Platform Analytics**: Global metrics on users, companies, active jobs, and application volume.
- **User Management**: Search, filter, inspect, and suspend/reactivate Candidate and Recruiter accounts.
- **Real-Time Audit Logs**: Live stream of user actions, authentication events, and recruitment transitions stored in MongoDB `activity_logs`.

---

## Architecture & System Design

```
+---------------------------------------------------------------------------------------+
|                                    REACT FRONTEND                                     |
|    Vite + React 18 + TypeScript + Tailwind CSS + Lucide Icons + Recharts (Port 5173)    |
+-------------------------------------------+-------------------------------------------+
                                            |
                                            | REST API Requests (Axios + JWT Bearer)
                                            v
+---------------------------------------------------------------------------------------+
|                               SPRING BOOT 3.3.4 BACKEND                               |
|                                     (Port 8080)                                       |
|                                                                                       |
|  [Security / JWT] -----> [Controllers] -----> [Service Layer] -----> [File Storage]   |
|                             |                      |                      |           |
|                             v                      v                      v           |
|                       DTO Validation        Business Logic         Local Storage      |
|                       & Global Handler     & Error Isolation        (Secure Hash)     |
+--------------------------------+--------------------+---------------------------------+
                                 |                    |
                                 v                    v
                   +------------------------+  +------------------------+
                   |     Spring Data JPA    |  |  Spring Data MongoDB   |
                   +------------------------+  +------------------------+
                                 |                    |
                                 v                    v
                   +------------------------+  +------------------------+
                   |        MySQL 8         |  |       MongoDB 7        |
                   |      smarthire_db      |  |    smarthire_nosql     |
                   |                        |  |                        |
                   |  - users               |  |  - candidate_profiles  |
                   |  - companies           |  |  - interview_feedback  |
                   |  - jobs                |  |  - search_history      |
                   |  - applications        |  |  - activity_logs       |
                   |  - saved_jobs          |  |                        |
                   |  - notifications       |  |                        |
                   +------------------------+  +------------------------+
```

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend** | Java 21 / 23, Spring Boot 3.3.4, Spring Security, Spring Web, Spring Data JPA, Spring Data MongoDB, Hibernate 6, Flyway Migration, Bean Validation, JJWT 0.12.6, Lombok, Springdoc OpenAPI 2.6.0 |
| **Relational Database** | MySQL 8.0 (ACID transactions, strict foreign keys, unique constraints, Flyway schema versioning) |
| **Document Database** | MongoDB 7.0 (Flexible JSON documents, array queries, aggregation pipelines for skill trends) |
| **Frontend** | React 18, TypeScript 5.5, Vite 5, Tailwind CSS 3.4, React Router 6, Axios, Lucide React, Recharts |
| **Testing** | JUnit 5, Mockito, Spring Boot Test |
| **Build & Tools** | Maven 3.9+ (with Maven Wrapper `mvnw`), npm 10+, Docker & Docker Compose |

---

## Dual-Database Architecture

A key differentiator of SmartHire is its **Polyglot Persistence** pattern:

1. **MySQL 8 (`smarthire_db`)**:
   - Manages relational, strongly-typed entities requiring strict referential integrity and transactional safety.
   - Enforces unique constraints (e.g. `(job_id, candidate_id)` prevents double applications).
   - Managed automatically via versioned **Flyway** migration scripts (`V1__init_schema.sql`, `V2__seed_data.sql`).

2. **MongoDB 7 (`smarthire_nosql`)**:
   - Manages polymorphic, nested, and time-series documents:
     - `candidate_profiles`: Dynamic education arrays, work history, skills lists, certifications, and portfolio links.
     - `interview_feedback`: Multi-round interviewer notes, ratings, and evaluation feedback.
     - `search_history`: Search keyword frequency and candidate query analytics.
     - `activity_logs`: High-throughput audit trails of platform actions.
   - **Resilience Design**: MongoDB writes in services are isolated with fallback error handling, ensuring that transactional MySQL workflows complete even if the secondary document database experiences temporary network latency.

---

## Project Structure

```
Smart-Job-Portal/
├── .env.example                       # Reference environment variables
├── docker-compose.yml                 # Spin up MySQL 8 & MongoDB 7 with one command
├── docs/
│   ├── DATABASE_EXERCISES.md          # 10 SQL + 10 MongoDB runnable exercises
│   └── SmartHire_Postman_Collection.json # Complete API collection for testing
├── backend/
│   ├── pom.xml                        # Maven dependencies & build configuration
│   ├── mvnw / mvnw.cmd                # Maven wrapper executables
│   └── src/
│       ├── main/
│       │   ├── java/com/smarthire/
│       │   │   ├── config/            # Security, CORS, OpenAPI configs
│       │   │   ├── controller/        # REST endpoints (Auth, Job, Candidate, Recruiter, Admin, etc.)
│       │   │   ├── document/          # MongoDB document models
│       │   │   ├── dto/               # Request & response transfer objects
│       │   │   ├── entity/            # JPA MySQL entities & enums
│       │   │   ├── exception/         # Custom exceptions & global exception handler
│       │   │   ├── repository/        # MySQL & MongoDB repositories (with aggregations)
│       │   │   ├── security/          # JWT provider, filter, UserDetailsService
│       │   │   └── service/           # Core business services & file storage
│       │   └── resources/
│       │       ├── application.properties
│       │       └── db/migration/      # Flyway SQL migrations (V1 schema, V2 seed)
│       └── test/java/com/smarthire/   # JUnit 5 & Mockito test suites (17 automated tests)
└── frontend/
    ├── package.json                   # React 18, Vite, Tailwind dependencies
    ├── vite.config.ts                 # Dev server & proxy settings
    ├── tailwind.config.js             # Navy & soft-blue design system palette
    └── src/
        ├── components/                # Navbar, Footer, Sidebar, JobCard, ApplyModal, etc.
        ├── context/                   # AuthContext with token refresh & role state
        ├── pages/                     # Public, Candidate, Recruiter, and Admin pages
        ├── services/                  # Axios HTTP client with JWT interceptor
        └── types/                     # TypeScript data interfaces
```

---

## Prerequisites

Ensure the following tools are installed on your machine:
- **Java Development Kit (JDK)**: Version 21 or 23 (`java -version`)
- **Node.js**: Version 18+ or 20+ LTS (`node -v`) and npm (`npm -v`)
- **MySQL 8.0**: Local instance running on port 3306 or via Docker
- **MongoDB 7.0**: Local instance running on port 27017 or via Docker
- **Git**

---

## Getting Started (Step-by-Step)

### 1. Database Setup

#### Option A: Using Docker Compose (Easiest)
Run the pre-configured `docker-compose.yml` to spin up both databases in the background:
```bash
docker-compose up -d
```
This starts:
- **MySQL 8.0** on `localhost:3306` with database `smarthire_db` (user: `root`, password: `password123`)
- **MongoDB 7.0** on `localhost:27017` with database `smarthire_nosql`

#### Option B: Using Native Local Services
1. **MySQL**: Open MySQL Workbench or shell and create the database:
   ```sql
   CREATE DATABASE IF NOT EXISTS smarthire_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
2. **MongoDB**: Ensure the MongoDB service is running on `mongodb://localhost:27017`.

---

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Review or update `src/main/resources/application.properties` with your MySQL credentials:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/smarthire_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=password123
   spring.data.mongodb.uri=mongodb://localhost:27017/smarthire_nosql
   ```

3. Run the Spring Boot application using the included Maven Wrapper:
   - **On Windows (PowerShell / Command Prompt)**:
     ```powershell
     .\mvnw.cmd spring-boot:run
     ```
   - **On macOS / Linux**:
     ```bash
     ./mvnw spring-boot:run
     ```

4. The backend will:
   - Run Flyway migrations (`V1` schema creation and `V2` seed data).
   - Seed default demo accounts with BCrypt-hashed passwords.
   - Initialize MongoDB candidate profiles and sample activity logs.
   - Start the HTTP REST server on **`http://localhost:8080`**.

---

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

---

## Demo Credentials

The system comes pre-loaded with sample accounts for all three roles. The Login page includes **Quick-Login Demo Buttons** to log in with a single click:

| Role | Email | Password | Pre-seeded Features |
| :--- | :--- | :--- | :--- |
| **Candidate** | `candidate@example.com` | `Candidate@123` | Full portfolio, sample applications, saved jobs, search history |
| **Recruiter** | `recruiter@techcorp.com` | `Recruiter@123` | TechCorp company profile, active job posts, candidate applicant pipeline |
| **Admin** | `admin@smarthire.com` | `Admin@123` | User suspension controls, job moderation, live MongoDB audit log stream |

---

## API Documentation

When the backend is running, explore and test the complete REST API using the interactive Swagger / OpenAPI interface:
- **Swagger UI**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI JSON**: [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs)

### Primary API Endpoints Overview

| Category | Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/api/auth/register` | Register new Candidate or Recruiter | Public |
| **Auth** | `POST` | `/api/auth/login` | Authenticate & receive JWT token | Public |
| **Auth** | `GET` | `/api/auth/me` | Fetch authenticated user profile | Any logged-in |
| **Jobs** | `GET` | `/api/jobs` | Search & filter jobs (paginated) | Public |
| **Jobs** | `GET` | `/api/jobs/{id}` | Get job details | Public |
| **Jobs** | `POST` | `/api/jobs` | Post a new job | `RECRUITER` |
| **Jobs** | `PUT` | `/api/jobs/{id}` | Edit job details | `RECRUITER` (Owner) |
| **Jobs** | `PATCH` | `/api/jobs/{id}/status` | Change job status (`ACTIVE`/`CLOSED`) | `RECRUITER` (Owner) |
| **Applications** | `POST` | `/api/jobs/{id}/applications` | Apply for a job | `CANDIDATE` |
| **Applications** | `GET` | `/api/candidate/applications` | Candidate's application list | `CANDIDATE` |
| **Applications** | `GET` | `/api/recruiter/jobs/{id}/applications` | Recruiter view of applicants | `RECRUITER` (Owner) |
| **Applications** | `PATCH` | `/api/applications/{id}/status` | Update applicant status | `RECRUITER` (Owner) |
| **Candidate** | `GET` | `/api/candidate/profile` | Relational profile data | `CANDIDATE` |
| **Candidate** | `GET`/`PUT` | `/api/candidate/extended-profile`| MongoDB rich profile (skills, education) | `CANDIDATE` |
| **Candidate** | `POST` | `/api/candidate/profile/photo` | Upload profile image | `CANDIDATE` |
| **Candidate** | `POST` | `/api/candidate/profile/resume` | Upload PDF resume | `CANDIDATE` |
| **Saved Jobs** | `GET`/`POST`/`DELETE` | `/api/candidate/saved-jobs` | Manage bookmarked jobs | `CANDIDATE` |
| **Interviews** | `POST` | `/api/interview-feedback` | Record interview round feedback | `RECRUITER` |
| **Admin** | `GET` | `/api/admin/dashboard` | Platform metrics & counts | `ADMIN` |
| **Admin** | `GET` | `/api/admin/users` | List platform users | `ADMIN` |
| **Admin** | `PATCH` | `/api/admin/users/{id}/toggle-status` | Suspend or reactivate user | `ADMIN` |
| **Admin** | `GET` | `/api/admin/activity-logs` | Stream live MongoDB audit events | `ADMIN` |

A ready-to-import Postman collection is also provided at [`docs/SmartHire_Postman_Collection.json`](docs/SmartHire_Postman_Collection.json).

---

## Academic Learning Component

To satisfy Computer Engineering academic evaluation and practical viva requirements, comprehensive exercises for both relational and document database paradigms are provided in [`docs/DATABASE_EXERCISES.md`](docs/DATABASE_EXERCISES.md):

- **10 SQL Exercises**:
  1. Filtered and Sorted Job Search (`WHERE`, `ORDER BY`, `LIMIT`)
  2. Candidate Application Insertion and Updates
  3. Relational Queries with `INNER JOIN` and `LEFT JOIN`
  4. Application Pipeline Aggregation with `GROUP BY` and `HAVING`
  5. Finding Jobs with Above-Average Salaries using Subqueries
  6. Understanding Primary and Foreign Key Constraints
  7. Enforcing Data Integrity via Unique Constraints
  8. Indexing and Query Performance Optimization
  9. ACID Transactional Integrity in Recruitment Status Updates
  10. Relational Normalization (1NF, 2NF, 3NF Analysis)

- **10 MongoDB Exercises**:
  1. Inserting and Querying Candidate Profile Documents
  2. Updating Embedded Arrays (`$push`, `$set`)
  3. Querying Elements within Nested Skill Arrays
  4. Comparison and Logical Operators (`$gte`, `$or`, `$in`)
  5. Aggregation Pipeline: Top Trending In-Demand Skills (`$unwind`, `$group`, `$sort`)
  6. Interview Feedback Average Rating Aggregations
  7. Compound and Multi-Key Indexes in MongoDB
  8. Schema Flexibility: Adding Portfolio and Certification Objects
  9. Search History Frequency and Query Analytics
  10. Architectural Trade-off Analysis: SQL vs. NoSQL

---

## Running Automated Tests

The backend includes a comprehensive suite of unit and integration tests powered by **JUnit 5** and **Mockito** with complete database isolation (`application-test.properties`).

To run tests:
```bash
cd backend
./mvnw test        # macOS / Linux
.\mvnw.cmd test    # Windows
```

Tested test cases include:
- `AuthServiceTest`: Candidate registration, recruiter registration, duplicate email rejection, invalid password handling.
- `JobServiceTest`: Job posting authorization, company-association checks, job search and filtering.
- `ApplicationServiceTest`: Successful application creation, duplicate application rejection (`400 Bad Request`), unauthorized recruiter status change rejection.
- `FileStorageServiceTest`: Image file validation, resume PDF storage, invalid extension rejection, secure path resolution.

---

## Troubleshooting Guide

### 1. MySQL Port Conflict (Port 3306 in use)
If another service is using port 3306:
- Check running services via Task Manager or `netstat -ano | findstr :3306`.
- Or modify the port in `docker-compose.yml` to `3307:3306` and update `application.properties` with port `3307`.

### 2. Access Denied for User 'root'@'localhost'
Verify your MySQL password in `backend/src/main/resources/application.properties`:
```properties
spring.datasource.password=YOUR_LOCAL_MYSQL_PASSWORD
```

### 3. MongoDB Connection Refused
If MongoDB is not running locally:
- Start MongoDB service via `net start MongoDB` (Windows) or `sudo systemctl start mongod` (Linux).
- Or run `docker-compose up -d mongodb`.
- Note: The SmartHire backend is built with error-resilience; if MongoDB is unavailable, core MySQL operations (Authentication, Job Postings, Applications) continue to function with fallback warning logs.

### 4. Frontend CORS Error
The backend is pre-configured to allow CORS requests from `http://localhost:5173` and `http://localhost:3000`. If running frontend on another port, adjust `CorsConfig.java` or `application.properties`.

---

## GitHub Upload Instructions

To upload this complete project to your personal GitHub repository:

1. Create a new repository on [GitHub](https://github.com/new) named `Smart-Job-Portal` (do NOT initialize with a README since you already have this one).

2. Open PowerShell or terminal in the project root:
   ```bash
   cd "c:\Users\helij\OneDrive\Documents\Smart Hire.java project"
   ```

3. Initialize and commit your code:
   ```bash
   git init
   git add .
   git commit -m "feat: complete SmartHire full-stack platform with dual MySQL and MongoDB architecture"
   ```

4. Link and push to your remote GitHub repository:
   ```bash
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/Smart-Job-Portal.git
   git push -u origin main
   ```

---

## Academic Verification & Evaluation Checklist

- [x] Dual-database persistence (MySQL 8 + MongoDB 7)
- [x] Clean layered architecture (Controller, Service, Repository, Entity, Document, DTO)
- [x] Stateless JWT authentication with role-based access control (`CANDIDATE`, `RECRUITER`, `ADMIN`)
- [x] Secure document & image uploads with MIME validation and secure download streaming
- [x] Reusable responsive UI design system with Tailwind CSS and Lucide icons
- [x] Real-time recruitment status pipeline tracker
- [x] Live MongoDB platform activity stream for administrators
- [x] Automated test suite passing with 0 errors
- [x] 10 SQL and 10 MongoDB runnable academic learning exercises
- [x] Complete Postman collection provided
- [x] Detailed setup and run documentation

---

**Built with passion for excellence in full-stack software engineering.**
