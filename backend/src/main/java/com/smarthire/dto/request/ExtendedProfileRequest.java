package com.smarthire.dto.request;

import com.smarthire.document.CandidateProfileDocument;

import java.util.List;
import java.util.Map;

public class ExtendedProfileRequest {
    private String headline;
    private List<String> skills;
    private List<CandidateProfileDocument.EducationItem> education;
    private List<CandidateProfileDocument.ExperienceItem> experience;
    private List<CandidateProfileDocument.ProjectItem> projects;
    private List<CandidateProfileDocument.CertificationItem> certifications;
    private Map<String, Object> resumeMetadata;
    private List<String> preferredLocations;
    private List<String> preferredEmploymentTypes;

    public ExtendedProfileRequest() {}

    public String getHeadline() { return headline; }
    public void setHeadline(String headline) { this.headline = headline; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public List<CandidateProfileDocument.EducationItem> getEducation() { return education; }
    public void setEducation(List<CandidateProfileDocument.EducationItem> education) { this.education = education; }
    public List<CandidateProfileDocument.ExperienceItem> getExperience() { return experience; }
    public void setExperience(List<CandidateProfileDocument.ExperienceItem> experience) { this.experience = experience; }
    public List<CandidateProfileDocument.ProjectItem> getProjects() { return projects; }
    public void setProjects(List<CandidateProfileDocument.ProjectItem> projects) { this.projects = projects; }
    public List<CandidateProfileDocument.CertificationItem> getCertifications() { return certifications; }
    public void setCertifications(List<CandidateProfileDocument.CertificationItem> certifications) { this.certifications = certifications; }
    public Map<String, Object> getResumeMetadata() { return resumeMetadata; }
    public void setResumeMetadata(Map<String, Object> resumeMetadata) { this.resumeMetadata = resumeMetadata; }
    public List<String> getPreferredLocations() { return preferredLocations; }
    public void setPreferredLocations(List<String> preferredLocations) { this.preferredLocations = preferredLocations; }
    public List<String> getPreferredEmploymentTypes() { return preferredEmploymentTypes; }
    public void setPreferredEmploymentTypes(List<String> preferredEmploymentTypes) { this.preferredEmploymentTypes = preferredEmploymentTypes; }
}
