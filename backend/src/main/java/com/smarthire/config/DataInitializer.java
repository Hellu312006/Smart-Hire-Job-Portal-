package com.smarthire.config;

import com.smarthire.document.ActivityLogDocument;
import com.smarthire.document.CandidateProfileDocument;
import com.smarthire.document.InterviewFeedbackDocument;
import com.smarthire.document.SearchHistoryDocument;
import com.smarthire.entity.*;
import com.smarthire.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final InterviewFeedbackRepository interviewFeedbackRepository;
    private final SearchHistoryRepository searchHistoryRepository;
    private final ActivityLogRepository activityLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${ADMIN_DEFAULT_EMAIL:admin@smarthire.com}")
    private String adminEmail;

    @Value("${ADMIN_DEFAULT_PASSWORD:Admin@123}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository,
                           CompanyRepository companyRepository,
                           JobRepository jobRepository,
                           ApplicationRepository applicationRepository,
                           SavedJobRepository savedJobRepository,
                           CandidateProfileRepository candidateProfileRepository,
                           InterviewFeedbackRepository interviewFeedbackRepository,
                           SearchHistoryRepository searchHistoryRepository,
                           ActivityLogRepository activityLogRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.interviewFeedbackRepository = interviewFeedbackRepository;
        this.searchHistoryRepository = searchHistoryRepository;
        this.activityLogRepository = activityLogRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        logger.info("Initializing SmartHire seed data & verifying default credentials...");

        try {
            initMySQLData();
        } catch (Exception ex) {
            logger.warn("MySQL data initialization note: {}", ex.getMessage());
        }

        try {
            initMongoDBData();
        } catch (Exception ex) {
            logger.warn("MongoDB data initialization note: {}", ex.getMessage());
        }

        logger.info("SmartHire data initialization completed successfully.");
    }

    private void initMySQLData() {
        // Ensure Admin Account
        if (!userRepository.existsByEmail(adminEmail)) {
            User admin = new User("System Administrator", adminEmail, passwordEncoder.encode(adminPassword), Role.ADMIN);
            userRepository.save(admin);
            logger.info("Created default administrator: {}", adminEmail);
        }

        // Ensure Recruiter 1
        User recruiter1 = userRepository.findByEmail("recruiter@techcorp.com").orElseGet(() -> {
            User r = new User("Sarah Jenkins", "recruiter@techcorp.com", passwordEncoder.encode("Recruiter@123"), Role.RECRUITER);
            return userRepository.save(r);
        });

        // Ensure Recruiter 2
        User recruiter2 = userRepository.findByEmail("david.recruiter@cloudscale.io").orElseGet(() -> {
            User r = new User("David Zhang", "david.recruiter@cloudscale.io", passwordEncoder.encode("Recruiter@123"), Role.RECRUITER);
            return userRepository.save(r);
        });

        // Ensure Candidate
        User candidate = userRepository.findByEmail("candidate@example.com").orElseGet(() -> {
            User c = new User("Alex Mercer", "candidate@example.com", passwordEncoder.encode("Candidate@123"), Role.CANDIDATE);
            return userRepository.save(c);
        });

        // Ensure Companies
        Company techCorp = companyRepository.findByRecruiterId(recruiter1.getId()).orElseGet(() -> {
            Company comp = new Company(
                    "TechCorp Solutions",
                    "Leading enterprise SaaS provider delivering next-generation digital cloud platforms worldwide.",
                    "https://techcorp.example.com",
                    "Information Technology",
                    "San Francisco, CA",
                    recruiter1
            );
            return companyRepository.save(comp);
        });

        Company cloudScale = companyRepository.findByRecruiterId(recruiter2.getId()).orElseGet(() -> {
            Company comp = new Company(
                    "CloudScale Networks",
                    "Global cloud computing and DevOps infrastructure consultancy powering high-frequency platforms.",
                    "https://cloudscale.example.com",
                    "Cloud Computing",
                    "Austin, TX",
                    recruiter2
            );
            return companyRepository.save(comp);
        });

        // Ensure Jobs
        if (jobRepository.count() == 0) {
            Job job1 = new Job();
            job1.setCompany(techCorp);
            job1.setTitle("Senior Full Stack Java Engineer");
            job1.setDescription("Join our core platform engineering group building ultra-reliable microservices in Java 21, Spring Boot 3, and high-performance React frontends. You will architect distributed APIs, optimize database queries, and lead code reviews.");
            job1.setRequirements("Bachelor in Computer Science or equivalent. 4+ years of Java/Spring Boot experience. Solid proficiency in React, TypeScript, MySQL, MongoDB, and CI/CD pipelines.");
            job1.setLocation("San Francisco, CA (Hybrid)");
            job1.setMinSalary(new BigDecimal("125000.00"));
            job1.setMaxSalary(new BigDecimal("165000.00"));
            job1.setEmploymentType(EmploymentType.FULL_TIME);
            job1.setExperienceLevel(ExperienceLevel.SENIOR);
            job1.setStatus(JobStatus.ACTIVE);
            jobRepository.save(job1);

            Job job2 = new Job();
            job2.setCompany(techCorp);
            job2.setTitle("Frontend React Developer");
            job2.setDescription("We are seeking a creative Frontend Engineer to design and implement responsive, high-aesthetic web interfaces with React, TypeScript, and modern CSS systems.");
            job2.setRequirements("Strong knowledge of React, TypeScript, state management, REST API integration, and web performance optimization.");
            job2.setLocation("Remote");
            job2.setMinSalary(new BigDecimal("85000.00"));
            job2.setMaxSalary(new BigDecimal("115000.00"));
            job2.setEmploymentType(EmploymentType.REMOTE);
            job2.setExperienceLevel(ExperienceLevel.MID);
            job2.setStatus(JobStatus.ACTIVE);
            jobRepository.save(job2);

            Job job3 = new Job();
            job3.setCompany(cloudScale);
            job3.setTitle("DevOps & Cloud Infrastructure Specialist");
            job3.setDescription("Own our AWS/GCP infrastructure, Kubernetes orchestration clusters, Docker container workflows, and automated deployment pipelines.");
            job3.setRequirements("Hands-on experience with AWS, Kubernetes, Terraform, Docker, and Linux systems administration.");
            job3.setLocation("Austin, TX");
            job3.setMinSalary(new BigDecimal("130000.00"));
            job3.setMaxSalary(new BigDecimal("170000.00"));
            job3.setEmploymentType(EmploymentType.FULL_TIME);
            job3.setExperienceLevel(ExperienceLevel.SENIOR);
            job3.setStatus(JobStatus.ACTIVE);
            jobRepository.save(job3);

            // Applications
            if (!applicationRepository.existsByJobIdAndCandidateId(job1.getId(), candidate.getId())) {
                Application app1 = new Application(job1, candidate, null, "I have 4+ years of experience working with Java Spring Boot and React.");
                app1.setStatus(ApplicationStatus.SHORTLISTED);
                applicationRepository.save(app1);
            }

            // Saved Jobs
            if (!savedJobRepository.existsByCandidateIdAndJobId(candidate.getId(), job3.getId())) {
                savedJobRepository.save(new SavedJob(candidate, job3));
            }
        }
    }

    private void initMongoDBData() {
        User candidate = userRepository.findByEmail("candidate@example.com").orElse(null);
        if (candidate == null) return;

        // Seed Candidate Profile in MongoDB
        if (!candidateProfileRepository.existsByUserId(candidate.getId())) {
            CandidateProfileDocument profile = new CandidateProfileDocument();
            profile.setUserId(candidate.getId());
            profile.setHeadline("Full Stack Java Engineer | Spring Boot 3 & React Enthusiast");
            profile.setSkills(Arrays.asList("Java 21", "Spring Boot", "React", "TypeScript", "MySQL", "MongoDB", "Docker", "RESTful APIs", "Tailwind CSS"));

            profile.getEducation().add(new CandidateProfileDocument.EducationItem(
                    "Bachelor of Engineering in Computer Engineering",
                    "University Institute of Technology",
                    "2020 - 2024",
                    "9.2 CGPA"
            ));

            profile.getExperience().add(new CandidateProfileDocument.ExperienceItem(
                    "Innovatech Software Labs",
                    "Software Engineer Intern",
                    "Jan 2024 - Jun 2024",
                    "Implemented RESTful backend microservices in Spring Boot and optimized MySQL database indexing, reducing latency by 35%."
            ));

            profile.getProjects().add(new CandidateProfileDocument.ProjectItem(
                    "SmartHire Recruitment Platform",
                    "Architected an enterprise recruitment portal pairing MySQL transactional integrity with MongoDB document flexibility.",
                    "Java 21, Spring Boot 3, React, TypeScript, MySQL, MongoDB",
                    "https://github.com/smarthire/portal"
            ));

            profile.getCertifications().add(new CandidateProfileDocument.CertificationItem(
                    "Oracle Certified Professional: Java SE 21 Developer",
                    "Oracle University",
                    "2024"
            ));

            profile.setPreferredLocations(Arrays.asList("San Francisco, CA", "Austin, TX", "Remote"));
            profile.setPreferredEmploymentTypes(Arrays.asList("FULL_TIME", "REMOTE"));
            profile.setUpdatedAt(LocalDateTime.now());

            candidateProfileRepository.save(profile);
            logger.info("MongoDB: Seeded candidate profile document for user #{}", candidate.getId());
        }

        // Seed Interview Feedback in MongoDB
        List<Application> apps = applicationRepository.findByCandidateId(candidate.getId());
        if (!apps.isEmpty()) {
            Application firstApp = apps.get(0);
            if (interviewFeedbackRepository.findByApplicationIdOrderByCreatedAtDesc(firstApp.getId()).isEmpty()) {
                InterviewFeedbackDocument feedback = new InterviewFeedbackDocument(
                        firstApp.getId(),
                        firstApp.getJob().getCompany().getRecruiter().getId(),
                        firstApp.getJob().getCompany().getRecruiter().getFullName(),
                        "Technical Round 1 - System Architecture & Java 21",
                        Arrays.asList("Spring Boot 3", "Microservices", "JPA Performance", "Concurrency", "React State Management"),
                        5,
                        "Alex demonstrated exceptional grasp of Spring Boot fundamentals, database indexing, and clear architectural modularity. Highly recommended to move forward to the executive round."
                );
                interviewFeedbackRepository.save(feedback);
                logger.info("MongoDB: Seeded interview feedback document for application #{}", firstApp.getId());
            }
        }

        // Seed Search History in MongoDB
        if (searchHistoryRepository.findTop20ByUserIdOrderBySearchedAtDesc(candidate.getId()).isEmpty()) {
            searchHistoryRepository.save(new SearchHistoryDocument(candidate.getId(), "Full Stack Java", "San Francisco, CA", Collections.emptyMap()));
            searchHistoryRepository.save(new SearchHistoryDocument(candidate.getId(), "React TypeScript", "Remote", Collections.emptyMap()));
            searchHistoryRepository.save(new SearchHistoryDocument(candidate.getId(), "DevOps Engineer", "Austin, TX", Collections.emptyMap()));
            logger.info("MongoDB: Seeded search history documents");
        }

        // Seed Activity Log
        activityLogRepository.save(new ActivityLogDocument(
                1L,
                adminEmail,
                "SYSTEM_STARTUP",
                "SmartHire Platform backend started with dual MySQL & MongoDB configuration",
                "127.0.0.1"
        ));
    }
}
