-- ===================================================================
-- Flyway Migration V2: Seed Default Data
-- ===================================================================

-- Initial Users (Password: Admin@123, Recruiter@123, Candidate@123)
-- BCrypt hashed with 10 rounds:
-- $2a$10$7v59QyOQj.E5o6Fh9c6/0.E38PzX5Q86uS8K1d3WqF/uFw4v2F992 (Default test hash)
INSERT INTO users (id, full_name, email, password_hash, role, profile_image_path, enabled, created_at, updated_at)
VALUES 
(1, 'System Administrator', 'admin@smarthire.com', '$2a$10$7v59QyOQj.E5o6Fh9c6/0.E38PzX5Q86uS8K1d3WqF/uFw4v2F992', 'ADMIN', NULL, TRUE, NOW(), NOW()),
(2, 'Sarah Jenkins', 'recruiter@techcorp.com', '$2a$10$7v59QyOQj.E5o6Fh9c6/0.E38PzX5Q86uS8K1d3WqF/uFw4v2F992', 'RECRUITER', NULL, TRUE, NOW(), NOW()),
(3, 'Alex Mercer', 'candidate@example.com', '$2a$10$7v59QyOQj.E5o6Fh9c6/0.E38PzX5Q86uS8K1d3WqF/uFw4v2F992', 'CANDIDATE', NULL, TRUE, NOW(), NOW()),
(4, 'David Zhang', 'david.recruiter@cloudscale.io', '$2a$10$7v59QyOQj.E5o6Fh9c6/0.E38PzX5Q86uS8K1d3WqF/uFw4v2F992', 'RECRUITER', NULL, TRUE, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Seed Companies
INSERT INTO companies (id, name, description, website, industry, location, logo_path, recruiter_id, created_at, updated_at)
VALUES
(1, 'TechCorp Solutions', 'Leading enterprise SaaS provider delivering next-generation digital cloud platforms worldwide.', 'https://techcorp.example.com', 'Information Technology', 'San Francisco, CA', NULL, 2, NOW(), NOW()),
(2, 'CloudScale Networks', 'Global cloud computing and DevOps infrastructure consultancy powering high-frequency platforms.', 'https://cloudscale.example.com', 'Cloud Computing', 'Austin, TX', NULL, 4, NOW(), NOW()),
(3, 'FinTech Innovations', 'Modern algorithmic payment gateway and distributed banking ledger systems.', 'https://fintech.example.com', 'Financial Technology', 'New York, NY', NULL, 2, NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Seed Jobs
INSERT INTO jobs (id, company_id, title, description, requirements, location, min_salary, max_salary, employment_type, experience_level, status, created_at, updated_at)
VALUES
(1, 1, 'Senior Full Stack Java Engineer', 
'Join our core platform engineering group building ultra-reliable microservices in Java 21, Spring Boot 3, and high-performance React frontends. You will architect distributed APIs, optimize database queries, and lead code reviews.',
'Bachelor in Computer Science or equivalent. 4+ years of Java/Spring Boot experience. Solid proficiency in React, TypeScript, MySQL, MongoDB, and CI/CD pipelines.',
'San Francisco, CA (Hybrid)', 125000.00, 165000.00, 'FULL_TIME', 'SENIOR', 'ACTIVE', NOW(), NOW()),

(2, 1, 'Frontend React Developer', 
'We are seeking a creative Frontend Engineer to design and implement responsive, high-aesthetic web interfaces with React, TypeScript, and modern CSS systems.',
'Strong knowledge of React, TypeScript, state management, REST API integration, and web performance optimization.',
'Remote', 85000.00, 115000.00, 'REMOTE', 'MID', 'ACTIVE', NOW(), NOW()),

(3, 2, 'DevOps & Cloud Infrastructure Specialist', 
'Own our AWS/GCP infrastructure, Kubernetes orchestration clusters, Docker container workflows, and automated deployment pipelines.',
'Hands-on experience with AWS, Kubernetes, Terraform, Docker, and Linux systems administration.',
'Austin, TX', 130000.00, 170000.00, 'FULL_TIME', 'SENIOR', 'ACTIVE', NOW(), NOW()),

(4, 3, 'Backend Java & Spring Boot Developer', 
'Design high-throughput payment transaction pipelines with MySQL, Spring Data JPA, and secure REST endpoints.',
'2+ years experience in Java backend development, relational database indexing, and REST API design.',
'New York, NY (Hybrid)', 95000.00, 130000.00, 'FULL_TIME', 'MID', 'ACTIVE', NOW(), NOW()),

(5, 2, 'Junior Software Engineering Intern', 
'Fast-track your software engineering career working directly alongside senior architects on real-world cloud systems.',
'Pursuing BE/BTech in Computer Engineering. Knowledge of Java, Data Structures, Algorithms, and basic web fundamentals.',
'Austin, TX (Remote)', 45000.00, 60000.00, 'INTERNSHIP', 'ENTRY', 'ACTIVE', NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Seed Applications
INSERT INTO applications (id, job_id, candidate_id, status, resume_path, cover_letter, applied_at, updated_at)
VALUES
(1, 1, 3, 'SHORTLISTED', NULL, 'I have 3+ years of experience working with Java Spring Boot and React and would love to contribute to TechCorp.', NOW(), NOW()),
(2, 2, 3, 'APPLIED', NULL, 'Passionate about building responsive, modern user interfaces with React and TypeScript.', NOW(), NOW())
ON DUPLICATE KEY UPDATE id=id;

-- Seed Saved Jobs
INSERT INTO saved_jobs (id, candidate_id, job_id, saved_at)
VALUES
(1, 3, 3, NOW()),
(2, 3, 4, NOW())
ON DUPLICATE KEY UPDATE id=id;
