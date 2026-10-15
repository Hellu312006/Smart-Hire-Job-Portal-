package com.smarthire.dto.response;

import java.util.List;
import java.util.Map;

public class RecruiterDashboardDto {
    private long activeJobs;
    private long totalApplicants;
    private long shortlistedCount;
    private long rejectedCount;
    private Map<String, Long> applicationsByStatus;
    private List<ApplicationDto> recentApplicants;
    private List<JobDto> activeJobList;

    public RecruiterDashboardDto() {}

    public long getActiveJobs() { return activeJobs; }
    public void setActiveJobs(long activeJobs) { this.activeJobs = activeJobs; }
    public long getTotalApplicants() { return totalApplicants; }
    public void setTotalApplicants(long totalApplicants) { this.totalApplicants = totalApplicants; }
    public long getShortlistedCount() { return shortlistedCount; }
    public void setShortlistedCount(long shortlistedCount) { this.shortlistedCount = shortlistedCount; }
    public long getRejectedCount() { return rejectedCount; }
    public void setRejectedCount(long rejectedCount) { this.rejectedCount = rejectedCount; }
    public Map<String, Long> getApplicationsByStatus() { return applicationsByStatus; }
    public void setApplicationsByStatus(Map<String, Long> applicationsByStatus) { this.applicationsByStatus = applicationsByStatus; }
    public List<ApplicationDto> getRecentApplicants() { return recentApplicants; }
    public void setRecentApplicants(List<ApplicationDto> recentApplicants) { this.recentApplicants = recentApplicants; }
    public List<JobDto> getActiveJobList() { return activeJobList; }
    public void setActiveJobList(List<JobDto> activeJobList) { this.activeJobList = activeJobList; }
}
