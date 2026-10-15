package com.smarthire.dto.response;

import java.util.List;

public class CandidateDashboardDto {
    private int profileCompleteness;
    private long totalApplications;
    private long shortlistedApplications;
    private long rejectedApplications;
    private long savedJobsCount;
    private List<ApplicationDto> recentApplications;
    private List<JobDto> recommendedJobs;

    public CandidateDashboardDto() {}

    public int getProfileCompleteness() { return profileCompleteness; }
    public void setProfileCompleteness(int profileCompleteness) { this.profileCompleteness = profileCompleteness; }
    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
    public long getShortlistedApplications() { return shortlistedApplications; }
    public void setShortlistedApplications(long shortlistedApplications) { this.shortlistedApplications = shortlistedApplications; }
    public long getRejectedApplications() { return rejectedApplications; }
    public void setRejectedApplications(long rejectedApplications) { this.rejectedApplications = rejectedApplications; }
    public long getSavedJobsCount() { return savedJobsCount; }
    public void setSavedJobsCount(long savedJobsCount) { this.savedJobsCount = savedJobsCount; }
    public List<ApplicationDto> getRecentApplications() { return recentApplications; }
    public void setRecentApplications(List<ApplicationDto> recentApplications) { this.recentApplications = recentApplications; }
    public List<JobDto> getRecommendedJobs() { return recommendedJobs; }
    public void setRecommendedJobs(List<JobDto> recommendedJobs) { this.recommendedJobs = recommendedJobs; }
}
