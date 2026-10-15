package com.smarthire.controller;

import com.smarthire.dto.request.CreateJobRequest;
import com.smarthire.dto.request.UpdateJobRequest;
import com.smarthire.dto.response.ApiResponse;
import com.smarthire.dto.response.JobDto;
import com.smarthire.dto.response.PagedResponse;
import com.smarthire.entity.EmploymentType;
import com.smarthire.entity.ExperienceLevel;
import com.smarthire.entity.JobStatus;
import com.smarthire.entity.Role;
import com.smarthire.security.SecurityUtils;
import com.smarthire.service.JobService;
import com.smarthire.service.SearchHistoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Jobs", description = "Public and recruiter endpoints for job discovery, filtering, and management")
public class JobController {

    private final JobService jobService;
    private final SearchHistoryService searchHistoryService;

    public JobController(JobService jobService, SearchHistoryService searchHistoryService) {
        this.jobService = jobService;
        this.searchHistoryService = searchHistoryService;
    }

    @GetMapping
    @Operation(summary = "Search and filter active job opportunities with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> searchJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) EmploymentType employmentType,
            @RequestParam(required = false) ExperienceLevel experienceLevel,
            @RequestParam(required = false) BigDecimal minSalary,
            @RequestParam(required = false) BigDecimal maxSalary,
            @RequestParam(required = false) Long companyId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Long candidateId = null;
        if (SecurityUtils.getCurrentUserPrincipal().isPresent() && SecurityUtils.hasRole(Role.CANDIDATE)) {
            candidateId = SecurityUtils.getCurrentUserId();
            // Record search history asynchronously in MongoDB
            Map<String, Object> filters = new HashMap<>();
            if (employmentType != null) filters.put("employmentType", employmentType.name());
            if (experienceLevel != null) filters.put("experienceLevel", experienceLevel.name());
            searchHistoryService.recordSearch(candidateId, keyword, location, filters);
        }

        PagedResponse<JobDto> result = jobService.searchJobs(
                keyword, location, employmentType, experienceLevel, minSalary, maxSalary, companyId,
                page, size, sortBy, sortDir, candidateId
        );

        return ResponseEntity.ok(ApiResponse.success("Jobs retrieved successfully", result));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get detailed information for a specific job")
    public ResponseEntity<ApiResponse<JobDto>> getJobById(@PathVariable Long id) {
        Long candidateId = null;
        if (SecurityUtils.getCurrentUserPrincipal().isPresent() && SecurityUtils.hasRole(Role.CANDIDATE)) {
            candidateId = SecurityUtils.getCurrentUserId();
        }

        JobDto job = jobService.getJobById(id, candidateId);
        return ResponseEntity.ok(ApiResponse.success("Job retrieved", job));
    }

    @GetMapping("/featured")
    @Operation(summary = "Get featured high-priority job listings for landing page")
    public ResponseEntity<ApiResponse<List<JobDto>>> getFeaturedJobs(@RequestParam(defaultValue = "6") int limit) {
        List<JobDto> featured = jobService.getFeaturedJobs(limit);
        return ResponseEntity.ok(ApiResponse.success("Featured jobs retrieved", featured));
    }

    @PostMapping
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Post a new job opening (Recruiter only)")
    public ResponseEntity<ApiResponse<JobDto>> createJob(@Valid @RequestBody CreateJobRequest request) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        JobDto created = jobService.createJob(recruiterId, request);
        return new ResponseEntity<>(ApiResponse.success("Job posted successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Update an existing job opening")
    public ResponseEntity<ApiResponse<JobDto>> updateJob(@PathVariable Long id, @Valid @RequestBody UpdateJobRequest request) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        JobDto updated = jobService.updateJob(recruiterId, id, request);
        return ResponseEntity.ok(ApiResponse.success("Job updated successfully", updated));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('RECRUITER')")
    @Operation(summary = "Toggle job active or closed status")
    public ResponseEntity<ApiResponse<JobDto>> patchJobStatus(@PathVariable Long id, @RequestParam JobStatus status) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        JobDto updated = jobService.patchJobStatus(recruiterId, id, status);
        return ResponseEntity.ok(ApiResponse.success("Job status updated", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('RECRUITER', 'ADMIN')")
    @Operation(summary = "Delete a job listing")
    public ResponseEntity<ApiResponse<Void>> deleteJob(@PathVariable Long id) {
        Long userId = SecurityUtils.getCurrentUserId();
        Role role = SecurityUtils.getCurrentUserRole();
        jobService.deleteJob(userId, role, id);
        return ResponseEntity.ok(ApiResponse.success("Job listing removed"));
    }
}
