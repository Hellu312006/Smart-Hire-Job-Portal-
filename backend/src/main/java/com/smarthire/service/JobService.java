package com.smarthire.service;

import com.smarthire.dto.request.CreateJobRequest;
import com.smarthire.dto.request.UpdateJobRequest;
import com.smarthire.dto.response.JobDto;
import com.smarthire.dto.response.PagedResponse;
import com.smarthire.entity.*;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ForbiddenException;
import com.smarthire.exception.ResourceNotFoundException;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.CompanyRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.SavedJobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final SavedJobRepository savedJobRepository;
    private final ApplicationRepository applicationRepository;
    private final ActivityLogService activityLogService;

    public JobService(JobRepository jobRepository,
                      CompanyRepository companyRepository,
                      SavedJobRepository savedJobRepository,
                      ApplicationRepository applicationRepository,
                      ActivityLogService activityLogService) {
        this.jobRepository = jobRepository;
        this.companyRepository = companyRepository;
        this.savedJobRepository = savedJobRepository;
        this.applicationRepository = applicationRepository;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public JobDto createJob(Long recruiterId, CreateJobRequest request) {
        Company company = companyRepository.findByRecruiterId(recruiterId)
                .orElseThrow(() -> new BadRequestException("Recruiter must establish a company profile before posting jobs"));

        Job job = new Job();
        job.setCompany(company);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceLevel(request.getExperienceLevel());
        job.setStatus(JobStatus.ACTIVE);

        Job saved = jobRepository.save(job);
        activityLogService.logActivity(recruiterId, "", "CREATE_JOB", "Posted job: " + saved.getTitle(), "127.0.0.1");

        return JobDto.fromEntity(saved);
    }

    @Transactional
    public JobDto updateJob(Long recruiterId, Long jobId, UpdateJobRequest request) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        validateJobOwnership(job, recruiterId);

        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequirements(request.getRequirements());
        job.setLocation(request.getLocation());
        job.setMinSalary(request.getMinSalary());
        job.setMaxSalary(request.getMaxSalary());
        job.setEmploymentType(request.getEmploymentType());
        job.setExperienceLevel(request.getExperienceLevel());
        if (request.getStatus() != null) {
            job.setStatus(request.getStatus());
        }

        Job updated = jobRepository.save(job);
        activityLogService.logActivity(recruiterId, "", "UPDATE_JOB", "Updated job: " + updated.getTitle(), "127.0.0.1");

        return JobDto.fromEntity(updated);
    }

    @Transactional
    public JobDto patchJobStatus(Long recruiterId, Long jobId, JobStatus status) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        validateJobOwnership(job, recruiterId);
        job.setStatus(status);

        Job saved = jobRepository.save(job);
        return JobDto.fromEntity(saved);
    }

    @Transactional
    public void deleteJob(Long userId, Role role, Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        if (role != Role.ADMIN) {
            validateJobOwnership(job, userId);
        }

        jobRepository.delete(job);
        activityLogService.logActivity(userId, "", "DELETE_JOB", "Deleted job id: " + jobId, "127.0.0.1");
    }

    public JobDto getJobById(Long jobId, Long candidateId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + jobId));

        JobDto dto = JobDto.fromEntity(job);
        if (candidateId != null) {
            dto.setSaved(savedJobRepository.existsByCandidateIdAndJobId(candidateId, jobId));
        }
        return dto;
    }

    public PagedResponse<JobDto> searchJobs(String keyword, String location, EmploymentType employmentType,
                                           ExperienceLevel experienceLevel, BigDecimal minSalary, BigDecimal maxSalary,
                                           Long companyId, int page, int size, String sortBy, String sortDir,
                                           Long currentCandidateId) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        Specification<Job> spec = (root, query, cb) -> {
            var predicates = cb.conjunction();

            predicates = cb.and(predicates, cb.equal(root.get("status"), JobStatus.ACTIVE));

            if (keyword != null && !keyword.trim().isEmpty()) {
                String pattern = "%" + keyword.trim().toLowerCase() + "%";
                var titlePredicate = cb.like(cb.lower(root.get("title")), pattern);
                var descPredicate = cb.like(cb.lower(root.get("description")), pattern);
                var compPredicate = cb.like(cb.lower(root.get("company").get("name")), pattern);
                predicates = cb.and(predicates, cb.or(titlePredicate, descPredicate, compPredicate));
            }

            if (location != null && !location.trim().isEmpty()) {
                predicates = cb.and(predicates, cb.like(cb.lower(root.get("location")), "%" + location.trim().toLowerCase() + "%"));
            }

            if (employmentType != null) {
                predicates = cb.and(predicates, cb.equal(root.get("employmentType"), employmentType));
            }

            if (experienceLevel != null) {
                predicates = cb.and(predicates, cb.equal(root.get("experienceLevel"), experienceLevel));
            }

            if (minSalary != null) {
                predicates = cb.and(predicates, cb.greaterThanOrEqualTo(root.get("maxSalary"), minSalary));
            }

            if (maxSalary != null) {
                predicates = cb.and(predicates, cb.lessThanOrEqualTo(root.get("minSalary"), maxSalary));
            }

            if (companyId != null) {
                predicates = cb.and(predicates, cb.equal(root.get("company").get("id"), companyId));
            }

            return predicates;
        };

        Page<Job> jobs = jobRepository.findAll(spec, pageable);

        List<JobDto> content = jobs.getContent().stream().map(job -> {
            JobDto dto = JobDto.fromEntity(job);
            if (currentCandidateId != null) {
                dto.setSaved(savedJobRepository.existsByCandidateIdAndJobId(currentCandidateId, job.getId()));
            }
            return dto;
        }).collect(Collectors.toList());

        return new PagedResponse<>(content, jobs.getNumber(), jobs.getSize(), jobs.getTotalElements(), jobs.getTotalPages(), jobs.isLast());
    }

    public PagedResponse<JobDto> getRecruiterJobs(Long recruiterId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findByCompanyRecruiterId(recruiterId, pageable);

        List<JobDto> content = jobs.getContent().stream().map(job -> {
            JobDto dto = JobDto.fromEntity(job);
            return dto;
        }).collect(Collectors.toList());

        return new PagedResponse<>(content, jobs.getNumber(), jobs.getSize(), jobs.getTotalElements(), jobs.getTotalPages(), jobs.isLast());
    }

    public List<JobDto> getFeaturedJobs(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
        Page<Job> jobs = jobRepository.findByStatus(JobStatus.ACTIVE, pageable);
        return jobs.getContent().stream().map(JobDto::fromEntity).collect(Collectors.toList());
    }

    private void validateJobOwnership(Job job, Long recruiterId) {
        if (!job.getCompany().getRecruiter().getId().equals(recruiterId)) {
            throw new ForbiddenException("You are not authorized to modify jobs posted by another company");
        }
    }
}
