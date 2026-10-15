package com.smarthire.dto.response;

import com.smarthire.document.ActivityLogDocument;

import java.util.List;
import java.util.Map;

public class AdminDashboardDto {
    private long totalUsers;
    private long totalCandidates;
    private long totalRecruiters;
    private long totalCompanies;
    private long totalJobs;
    private long activeJobs;
    private long totalApplications;
    private Map<String, Long> applicationsByStatus;
    private List<ActivityLogDocument> recentActivityLogs;
    private List<UserDto> recentUsers;

    public AdminDashboardDto() {}

    public long getTotalUsers() { return totalUsers; }
    public void setTotalUsers(long totalUsers) { this.totalUsers = totalUsers; }
    public long getTotalCandidates() { return totalCandidates; }
    public void setTotalCandidates(long totalCandidates) { this.totalCandidates = totalCandidates; }
    public long getTotalRecruiters() { return totalRecruiters; }
    public void setTotalRecruiters(long totalRecruiters) { this.totalRecruiters = totalRecruiters; }
    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long totalCompanies) { this.totalCompanies = totalCompanies; }
    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long totalJobs) { this.totalJobs = totalJobs; }
    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }
    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long totalApplications) { this.totalApplications = totalApplications; }
    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }
    public List<ActivityLogDocument> getRecentActivityLogs() { return recentActivityLogs; }
    public void setRecentActivityLogs(List<ActivityLogDocument> recentActivityLogs) { this.recentActivityLogs = recentActivityLogs; }
    public List<UserDto> getRecentUsers() { return recentUsers; }
    public void setRecentUsers(List<UserDto> recentUsers) { this.recentUsers = recentUsers; }
}
