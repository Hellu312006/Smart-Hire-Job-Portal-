package com.smarthire.service;

import com.smarthire.document.ActivityLogDocument;
import com.smarthire.document.CandidateProfileDocument;
import com.smarthire.dto.response.*;
import com.smarthire.entity.*;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ResourceNotFoundException;
import com.smarthire.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final SavedJobRepository savedJobRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final ActivityLogService activityLogService;

    public DashboardService(UserRepository userRepository,
                            CompanyRepository companyRepository,
                            JobRepository jobRepository,
                            ApplicationRepository applicationRepository,
                            SavedJobRepository savedJobRepository,
                            CandidateProfileRepository candidateProfileRepository,
                            ActivityLogService activityLogService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
        this.applicationRepository = applicationRepository;
        this.savedJobRepository = savedJobRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.activityLogService = activityLogService;
    }

    public CandidateDashboardDto getCandidateDashboard(Long candidateId) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));

        CandidateDashboardDto dto = new CandidateDashboardDto();

        // Application metrics
        dto.setTotalApplications(applicationRepository.countByCandidateId(candidateId));
        dto.setShortlistedApplications(applicationRepository.countByCandidateIdAndStatus(candidateId, ApplicationStatus.SHORTLISTED));
        dto.setRejectedApplications(applicationRepository.countByCandidateIdAndStatus(candidateId, ApplicationStatus.REJECTED));
        dto.setSavedJobsCount(savedJobRepository.countByCandidateId(candidateId));

        // Profile completeness calculation
        int completeness = 20; // Basic account created
        if (candidate.getProfileImagePath() != null) completeness += 15;

        try {
            Optional<CandidateProfileDocument> profileOpt = candidateProfileRepository.findByUserId(candidateId);
            if (profileOpt.isPresent()) {
                CandidateProfileDocument profile = profileOpt.get();
                if (profile.getHeadline() != null && !profile.getHeadline().isBlank()) completeness += 10;
                if (profile.getSkills() != null && !profile.getSkills().isEmpty()) completeness += 20;
                if (profile.getEducation() != null && !profile.getEducation().isEmpty()) completeness += 15;
                if (profile.getExperience() != null && !profile.getExperience().isEmpty()) completeness += 10;
                if (profile.getResumeMetadata() != null && !profile.getResumeMetadata().isEmpty()) completeness += 10;
            }
        } catch (Exception ex) {
            // Ignore MongoDB read failure for completeness calculation
        }
        dto.setProfileCompleteness(Math.min(100, completeness));

        // Recent applications
        Pageable recentAppPage = PageRequest.of(0, 5, Sort.by("appliedAt").descending());
        dto.setRecentApplications(applicationRepository.findByCandidateId(candidateId, recentAppPage)
                .getContent().stream().map(ApplicationDto::fromEntity).collect(Collectors.toList()));

        // Recommended jobs
        Pageable jobPage = PageRequest.of(0, 4, Sort.by("createdAt").descending());
        dto.setRecommendedJobs(jobRepository.findByStatus(JobStatus.ACTIVE, jobPage)
                .getContent().stream().map(JobDto::fromEntity).collect(Collectors.toList()));

        return dto;
    }

    public RecruiterDashboardDto getRecruiterDashboard(Long recruiterId) {
        RecruiterDashboardDto dto = new RecruiterDashboardDto();

        dto.setActiveJobs(jobRepository.countByCompanyRecruiterIdAndStatus(recruiterId, JobStatus.ACTIVE));
        dto.setTotalApplicants(applicationRepository.countByJobCompanyRecruiterId(recruiterId));
        dto.setShortlistedCount(applicationRepository.countByJobCompanyRecruiterIdAndStatus(recruiterId, ApplicationStatus.SHORTLISTED));
        dto.setRejectedCount(applicationRepository.countByJobCompanyRecruiterIdAndStatus(recruiterId, ApplicationStatus.REJECTED));

        // Status Map
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusMap.put(status.name(), 0L);
        }
        List<Object[]> statusCounts = applicationRepository.countApplicationsByStatusForRecruiter(recruiterId);
        for (Object[] row : statusCounts) {
            ApplicationStatus st = (ApplicationStatus) row[0];
            Long cnt = (Long) row[1];
            statusMap.put(st.name(), cnt);
        }
        dto.setApplicationsByStatus(statusMap);

        // Recent Applicants
        Pageable pageable = PageRequest.of(0, 6, Sort.by("appliedAt").descending());
        dto.setRecentApplicants(applicationRepository.findByJobCompanyRecruiterId(recruiterId, pageable)
                .getContent().stream().map(ApplicationDto::fromEntity).collect(Collectors.toList()));

        // Active Job List
        Pageable activeJobsPage = PageRequest.of(0, 5, Sort.by("createdAt").descending());
        dto.setActiveJobList(jobRepository.findByCompanyRecruiterId(recruiterId, activeJobsPage)
                .getContent().stream().map(JobDto::fromEntity).collect(Collectors.toList()));

        return dto;
    }

    public AdminDashboardDto getAdminDashboard() {
        AdminDashboardDto dto = new AdminDashboardDto();

        dto.setTotalUsers(userRepository.count());
        dto.setTotalCandidates(userRepository.countByRole(Role.CANDIDATE));
        dto.setTotalRecruiters(userRepository.countByRole(Role.RECRUITER));
        dto.setTotalCompanies(companyRepository.count());
        dto.setTotalJobs(jobRepository.count());
        dto.setActiveJobs(jobRepository.countByStatus(JobStatus.ACTIVE));
        dto.setTotalApplications(applicationRepository.count());

        // Platform application breakdown
        Map<String, Long> statusMap = new LinkedHashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusMap.put(status.name(), 0L);
        }
        List<Object[]> rows = applicationRepository.countApplicationsByStatusPlatformWide();
        for (Object[] row : rows) {
            ApplicationStatus st = (ApplicationStatus) row[0];
            Long cnt = (Long) row[1];
            statusMap.put(st.name(), cnt);
        }
        dto.setApplicationsByStatus(statusMap);

        // Recent activity logs from MongoDB
        dto.setRecentActivityLogs(activityLogService.getRecentLogs());

        // Recent users
        Pageable userPage = PageRequest.of(0, 10, Sort.by("createdAt").descending());
        dto.setRecentUsers(userRepository.findAll(userPage).getContent().stream()
                .map(UserDto::fromEntity).collect(Collectors.toList()));

        return dto;
    }

    public PagedResponse<UserDto> getAllUsers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<User> users = userRepository.findAll(pageable);
        List<UserDto> list = users.getContent().stream().map(UserDto::fromEntity).collect(Collectors.toList());
        return new PagedResponse<>(list, users.getNumber(), users.getSize(), users.getTotalElements(), users.getTotalPages(), users.isLast());
    }

    @Transactional
    public UserDto toggleUserStatus(Long adminId, Long targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + targetUserId));

        if (user.getRole() == Role.ADMIN) {
            throw new BadRequestException("Administrator accounts cannot be deactivated");
        }

        user.setEnabled(!user.isEnabled());
        User updated = userRepository.save(user);

        activityLogService.logActivity(adminId, "", "TOGGLE_USER_STATUS",
                "User #" + targetUserId + " enabled status changed to: " + user.isEnabled(), "127.0.0.1");

        return UserDto.fromEntity(updated);
    }
}
