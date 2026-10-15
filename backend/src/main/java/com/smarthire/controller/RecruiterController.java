package com.smarthire.controller;

import com.smarthire.document.CandidateProfileDocument;
import com.smarthire.document.InterviewFeedbackDocument;
import com.smarthire.dto.request.CreateInterviewFeedbackRequest;
import com.smarthire.dto.request.UpdateApplicationStatusRequest;
import com.smarthire.dto.response.*;
import com.smarthire.security.SecurityUtils;
import com.smarthire.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/recruiter")
@PreAuthorize("hasRole('RECRUITER')")
@Tag(name = "Recruiter", description = "Recruiter dashboard, job management, candidate tracking, and company profiles")
public class RecruiterController {

    private final DashboardService dashboardService;
    private final CompanyService companyService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final CandidateProfileService candidateProfileService;
    private final InterviewFeedbackService interviewFeedbackService;

    public RecruiterController(DashboardService dashboardService,
                               CompanyService companyService,
                               JobService jobService,
                               ApplicationService applicationService,
                               CandidateProfileService candidateProfileService,
                               InterviewFeedbackService interviewFeedbackService) {
        this.dashboardService = dashboardService;
        this.companyService = companyService;
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.candidateProfileService = candidateProfileService;
        this.interviewFeedbackService = interviewFeedbackService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Recruiter overview metrics, applications by status, and recent applicants")
    public ResponseEntity<ApiResponse<RecruiterDashboardDto>> getDashboard() {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        RecruiterDashboardDto dashboard = dashboardService.getRecruiterDashboard(recruiterId);
        return ResponseEntity.ok(ApiResponse.success("Recruiter dashboard loaded", dashboard));
    }

    @GetMapping("/company")
    @Operation(summary = "Get recruiter's corporate company profile")
    public ResponseEntity<ApiResponse<CompanyDto>> getCompanyProfile() {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        CompanyDto company = companyService.getCompanyByRecruiterId(recruiterId);
        return ResponseEntity.ok(ApiResponse.success("Company profile loaded", company));
    }

    @PutMapping("/company")
    @Operation(summary = "Update corporate company details")
    public ResponseEntity<ApiResponse<CompanyDto>> updateCompanyProfile(@RequestBody CompanyDto dto) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        CompanyDto updated = companyService.updateCompanyProfile(recruiterId, dto);
        return ResponseEntity.ok(ApiResponse.success("Company profile updated", updated));
    }

    @PostMapping(value = "/company/logo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload company brand logo")
    public ResponseEntity<ApiResponse<String>> uploadCompanyLogo(@RequestParam("file") MultipartFile file) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        String logoPath = companyService.uploadCompanyLogo(recruiterId, file);
        return ResponseEntity.ok(ApiResponse.success("Company logo uploaded successfully", logoPath));
    }

    @GetMapping("/jobs")
    @Operation(summary = "Get all jobs posted by the recruiter's company")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getPostedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        PagedResponse<JobDto> jobs = jobService.getRecruiterJobs(recruiterId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Posted jobs loaded", jobs));
    }

    @GetMapping("/jobs/{jobId}/applications")
    @Operation(summary = "View candidate applications for a specific job")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getJobApplications(
            @PathVariable Long jobId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        PagedResponse<ApplicationDto> applications = applicationService.getRecruiterApplicationsForJob(recruiterId, jobId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    @GetMapping("/applications")
    @Operation(summary = "View all applicants across all posted jobs")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getAllApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        PagedResponse<ApplicationDto> applications = applicationService.getAllRecruiterApplications(recruiterId, page, size);
        return ResponseEntity.ok(ApiResponse.success("All applications loaded", applications));
    }

    @PatchMapping("/applications/{id}/status")
    @Operation(summary = "Update applicant status (SHORTLISTED, REJECTED, etc.)")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateApplicationStatusRequest request) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        ApplicationDto updated = applicationService.updateApplicationStatus(recruiterId, id, request);
        return ResponseEntity.ok(ApiResponse.success("Application status updated to " + request.getStatus(), updated));
    }

    @GetMapping("/candidates/{candidateId}/profile")
    @Operation(summary = "Inspect candidate's comprehensive profile from MongoDB")
    public ResponseEntity<ApiResponse<CandidateProfileDocument>> getCandidateProfile(@PathVariable Long candidateId) {
        CandidateProfileDocument profile = candidateProfileService.getProfileByUserId(candidateId);
        return ResponseEntity.ok(ApiResponse.success("Candidate profile loaded", profile));
    }

    @PostMapping("/interview-feedback")
    @Operation(summary = "Record interview evaluation notes and ratings in MongoDB")
    public ResponseEntity<ApiResponse<InterviewFeedbackDocument>> addInterviewFeedback(
            @Valid @RequestBody CreateInterviewFeedbackRequest request) {
        Long recruiterId = SecurityUtils.getCurrentUserId();
        InterviewFeedbackDocument feedback = interviewFeedbackService.addFeedback(recruiterId, request);
        return new ResponseEntity<>(ApiResponse.success("Interview feedback recorded", feedback), HttpStatus.CREATED);
    }
}
