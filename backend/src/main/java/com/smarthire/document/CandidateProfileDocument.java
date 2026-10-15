package com.smarthire.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Document(collection = "candidate_profiles")
public class CandidateProfileDocument {

    @Id
    private String id;

    @Indexed(unique = true)
    private Long userId;

    private String headline;
    private List<String> skills = new ArrayList<>();
    private List<EducationItem> education = new ArrayList<>();
    private List<ExperienceItem> experience = new ArrayList<>();
    private List<ProjectItem> projects = new ArrayList<>();
    private List<CertificationItem> certifications = new ArrayList<>();
    private Map<String, Object> resumeMetadata = new HashMap<>();
    private List<String> preferredLocations = new ArrayList<>();
    private List<String> preferredEmploymentTypes = new ArrayList<>();
    private LocalDateTime updatedAt;

    public CandidateProfileDocument() {
        this.updatedAt = LocalDateTime.now();
    }

    public CandidateProfileDocument(Long userId, String headline, List<String> skills) {
        this.userId = userId;
        this.headline = headline;
        this.skills = skills != null ? skills : new ArrayList<>();
        this.updatedAt = LocalDateTime.now();
    }

    // Nested Model Classes
    public static class EducationItem {
        private String degree;
        private String institution;
        private String year;
        private String grade;

        public EducationItem() {}
        public EducationItem(String degree, String institution, String year, String grade) {
            this.degree = degree;
            this.institution = institution;
            this.year = year;
            this.grade = grade;
        }
        public String getDegree() { return degree; }
        public void setDegree(String degree) { this.degree = degree; }
        public String getInstitution() { return institution; }
        public void setInstitution(String institution) { this.institution = institution; }
        public String getYear() { return year; }
        public void setYear(String year) { this.year = year; }
        public String getGrade() { return grade; }
        public void setGrade(String grade) { this.grade = grade; }
    }

    public static class ExperienceItem {
        private String company;
        private String role;
        private String duration;
        private String description;

        public ExperienceItem() {}
        public ExperienceItem(String company, String role, String duration, String description) {
            this.company = company;
            this.role = role;
            this.duration = duration;
            this.description = description;
        }
        public String getCompany() { return company; }
        public void setCompany(String company) { this.company = company; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
        public String getDuration() { return duration; }
        public void setDuration(String duration) { this.duration = duration; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }

    public static class ProjectItem {
        private String title;
        private String description;
        private String techStack;
        private String projectUrl;

        public ProjectItem() {}
        public ProjectItem(String title, String description, String techStack, String projectUrl) {
            this.title = title;
            this.description = description;
            this.techStack = techStack;
            this.projectUrl = projectUrl;
        }
        public String getTitle() { return title; }
        public void setTitle(String title) { this.title = title; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
        public String getTechStack() { return techStack; }
        public void setTechStack(String techStack) { this.techStack = techStack; }
        public String getProjectUrl() { return projectUrl; }
        public void setProjectUrl(String projectUrl) { this.projectUrl = projectUrl; }
    }

    public static class CertificationItem {
        private String name;
        private String issuingOrganization;
        private String issueDate;

        public CertificationItem() {}
        public CertificationItem(String name, String issuingOrganization, String issueDate) {
            this.name = name;
            this.issuingOrganization = issuingOrganization;
            this.issueDate = issueDate;
        }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public String getIssuingOrganization() { return issuingOrganization; }
        public void setIssuingOrganization(String issuingOrganization) { this.issuingOrganization = issuingOrganization; }
        public String getIssueDate() { return issueDate; }
        public void setIssueDate(String issueDate) { this.issueDate = issueDate; }
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public List<EducationItem> getEducation() { return education; }
    public void setEducation(List<EducationItem> education) { this.education = education; }
    public List<ExperienceItem> getExperience() { return experience; }
    public void setExperience(List<ExperienceItem> experience) { this.experience = experience; }
    public List<ProjectItem> getProjects() { return projects; }
    public void setProjects(List<ProjectItem> projects) { this.projects = projects; }
    public List<CertificationItem> getCertifications() { return certifications; }
    public void setCertifications(List<CertificationItem> certifications) { this.certifications = certifications; }
    public Map<String, Object> getResumeMetadata() { return resumeMetadata; }
    public void setResumeMetadata(Map<String, Object> resumeMetadata) { this.resumeMetadata = resumeMetadata; }
    public List<String> getPreferredLocations() { return preferredLocations; }
    public void setPreferredLocations(List<String> preferredLocations) { this.preferredLocations = preferredLocations; }
    public List<String> getPreferredEmploymentTypes() { return preferredEmploymentTypes; }
    public void setPreferredEmploymentTypes(List<String> preferredEmploymentTypes) { this.preferredEmploymentTypes = preferredEmploymentTypes; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
