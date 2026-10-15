package com.smarthire.service;

import com.smarthire.dto.request.ApplyJobRequest;
import com.smarthire.dto.request.UpdateApplicationStatusRequest;
import com.smarthire.dto.response.ApplicationDto;
import com.smarthire.dto.response.JobDto;
import com.smarthire.dto.response.PagedResponse;
import com.smarthire.entity.*;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ForbiddenException;
import com.smarthire.exception.ResourceNotFoundException;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.SavedJobRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final SavedJobRepository savedJobRepository;
    private final FileStorageService fileStorageService;
    private final ActivityLogService activityLogService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              JobRepository jobRepository,
                              UserRepository userRepository,
                              SavedJobRepository savedJobRepository,
                              FileStorageService fileStorageService,
                              ActivityLogService activityLogService) {
        this.applicationRepository = applicationRepository;
        this.jobRepository = jobRepository;
        this.userRepository = userRepository;
        this.savedJobRepository = savedJobRepository;
        this.fileStorageService = fileStorageService;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public ApplicationDto applyForJob(Long candidateId, Long jobId, String coverLetter, MultipartFile resumeFile) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found with id: " + candidateId));

        if (candidate.getRole() != Role.CANDIDATE) {
            throw new ForbiddenException("Only candidates can submit job applications");
        }

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (job.getStatus() != JobStatus.ACTIVE) {
            throw new BadRequestException("This job listing is currently closed and no longer accepting applications");
        }

        // Prevent duplicate application
        if (applicationRepository.existsByJobIdAndCandidateId(jobId, candidateId)) {
            throw new BadRequestException("You have already submitted an application for this position");
        }

        String resumePath = null;
        if (resumeFile != null && !resumeFile.isEmpty()) {
            resumePath = fileStorageService.storeResume(resumeFile);
        }

        Application application = new Application(job, candidate, resumePath, coverLetter);
        Application saved = applicationRepository.save(application);

        activityLogService.logActivity(candidateId, candidate.getEmail(), "APPLY_JOB",
                "Applied for job: " + job.getTitle() + " at " + job.getCompany().getName(), "127.0.0.1");

        return ApplicationDto.fromEntity(saved);
    }

    public PagedResponse<ApplicationDto> getCandidateApplications(Long candidateId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByCandidateId(candidateId, pageable);

        List<ApplicationDto> content = applications.getContent().stream()
                .map(ApplicationDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, applications.getNumber(), applications.getSize(),
                applications.getTotalElements(), applications.getTotalPages(), applications.isLast());
    }

    public PagedResponse<ApplicationDto> getRecruiterApplicationsForJob(Long recruiterId, Long jobId, int page, int size) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!job.getCompany().getRecruiter().getId().equals(recruiterId)) {
            throw new ForbiddenException("You cannot view applications for jobs from other companies");
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByJobId(jobId, pageable);

        List<ApplicationDto> content = applications.getContent().stream()
                .map(ApplicationDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, applications.getNumber(), applications.getSize(),
                applications.getTotalElements(), applications.getTotalPages(), applications.isLast());
    }

    public PagedResponse<ApplicationDto> getAllRecruiterApplications(Long recruiterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("appliedAt").descending());
        Page<Application> applications = applicationRepository.findByJobCompanyRecruiterId(recruiterId, pageable);

        List<ApplicationDto> content = applications.getContent().stream()
                .map(ApplicationDto::fromEntity)
                .collect(Collectors.toList());

        return new PagedResponse<>(content, applications.getNumber(), applications.getSize(),
                applications.getTotalElements(), applications.getTotalPages(), applications.isLast());
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long recruiterId, Long applicationId, UpdateApplicationStatusRequest request) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Validate recruiter ownership
        if (!application.getJob().getCompany().getRecruiter().getId().equals(recruiterId)) {
            throw new ForbiddenException("You are not authorized to update applications for this job");
        }

        application.setStatus(request.getStatus());
        Application saved = applicationRepository.save(application);

        activityLogService.logActivity(recruiterId, "", "UPDATE_APPLICATION_STATUS",
                "Updated application #" + applicationId + " status to " + request.getStatus(), "127.0.0.1");

        return ApplicationDto.fromEntity(saved);
    }

    public Resource getResumeResource(Long currentUserId, Role role, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        if (application.getResumePath() == null) {
            throw new ResourceNotFoundException("No resume file was attached to this application");
        }

        // Authorization check: Candidate themselves, Recruiter of the job, or Admin
        boolean isCandidate = application.getCandidate().getId().equals(currentUserId);
        boolean isRecruiter = application.getJob().getCompany().getRecruiter().getId().equals(currentUserId);
        boolean isAdmin = role == Role.ADMIN;

        if (!isCandidate && !isRecruiter && !isAdmin) {
            throw new ForbiddenException("You are not authorized to download this resume");
        }

        return fileStorageService.loadFileAsResource(application.getResumePath());
    }

    // Saved Jobs operations
    @Transactional
    public void saveJob(Long candidateId, Long jobId) {
        User candidate = userRepository.findById(candidateId)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (!savedJobRepository.existsByCandidateIdAndJobId(candidateId, jobId)) {
            SavedJob savedJob = new SavedJob(candidate, job);
            savedJobRepository.save(savedJob);
        }
    }

    @Transactional
    public void unsaveJob(Long candidateId, Long jobId) {
        savedJobRepository.deleteByCandidateIdAndJobId(candidateId, jobId);
    }

    public PagedResponse<JobDto> getSavedJobs(Long candidateId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("savedAt").descending());
        Page<SavedJob> savedPage = savedJobRepository.findByCandidateId(candidateId, pageable);

        List<JobDto> content = savedPage.getContent().stream()
                .map(sj -> {
                    JobDto dto = JobDto.fromEntity(sj.getJob());
                    dto.setSaved(true);
                    return dto;
                })
                .collect(Collectors.toList());

        return new PagedResponse<>(content, savedPage.getNumber(), savedPage.getSize(),
                savedPage.getTotalElements(), savedPage.getTotalPages(), savedPage.isLast());
    }
}
