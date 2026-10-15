package com.smarthire.controller;

import com.smarthire.document.CandidateProfileDocument;
import com.smarthire.document.InterviewFeedbackDocument;
import com.smarthire.document.SearchHistoryDocument;
import com.smarthire.dto.request.ExtendedProfileRequest;
import com.smarthire.dto.response.*;
import com.smarthire.security.SecurityUtils;
import com.smarthire.service.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/candidate")
@PreAuthorize("hasRole('CANDIDATE')")
@Tag(name = "Candidate", description = "Candidate dashboard, applications, profile, resume, and saved jobs")
public class CandidateController {

    private final DashboardService dashboardService;
    private final CandidateProfileService candidateProfileService;
    private final ApplicationService applicationService;
    private final SearchHistoryService searchHistoryService;
    private final InterviewFeedbackService interviewFeedbackService;

    public CandidateController(DashboardService dashboardService,
                               CandidateProfileService candidateProfileService,
                               ApplicationService applicationService,
                               SearchHistoryService searchHistoryService,
                               InterviewFeedbackService interviewFeedbackService) {
        this.dashboardService = dashboardService;
        this.candidateProfileService = candidateProfileService;
        this.applicationService = applicationService;
        this.searchHistoryService = searchHistoryService;
        this.interviewFeedbackService = interviewFeedbackService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get candidate overview dashboard metrics and recommendations")
    public ResponseEntity<ApiResponse<CandidateDashboardDto>> getDashboard() {
        Long candidateId = SecurityUtils.getCurrentUserId();
        CandidateDashboardDto dashboard = dashboardService.getCandidateDashboard(candidateId);
        return ResponseEntity.ok(ApiResponse.success("Candidate dashboard loaded", dashboard));
    }

    @GetMapping("/profile")
    @Operation(summary = "Get candidate extended profile from MongoDB")
    public ResponseEntity<ApiResponse<CandidateProfileDocument>> getProfile() {
        Long candidateId = SecurityUtils.getCurrentUserId();
        CandidateProfileDocument profile = candidateProfileService.getProfileByUserId(candidateId);
        return ResponseEntity.ok(ApiResponse.success("Candidate profile loaded", profile));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update candidate extended profile in MongoDB")
    public ResponseEntity<ApiResponse<CandidateProfileDocument>> updateProfile(@RequestBody ExtendedProfileRequest request) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        CandidateProfileDocument updated = candidateProfileService.updateExtendedProfile(candidateId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @PostMapping(value = "/profile/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload candidate profile photo")
    public ResponseEntity<ApiResponse<String>> uploadPhoto(@RequestParam("file") MultipartFile file) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        String path = candidateProfileService.uploadProfilePhoto(candidateId, file);
        return ResponseEntity.ok(ApiResponse.success("Profile photo uploaded", path));
    }

    @PostMapping(value = "/profile/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload candidate resume PDF and store metadata in MongoDB")
    public ResponseEntity<ApiResponse<String>> uploadResume(@RequestParam("file") MultipartFile file) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        String path = candidateProfileService.uploadResume(candidateId, file);
        return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully", path));
    }

    @PostMapping(value = "/jobs/{jobId}/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Submit a job application with optional resume and cover letter")
    public ResponseEntity<ApiResponse<ApplicationDto>> applyForJob(
            @PathVariable Long jobId,
            @RequestParam(required = false) String coverLetter,
            @RequestParam(value = "resume", required = false) MultipartFile resumeFile) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        ApplicationDto application = applicationService.applyForJob(candidateId, jobId, coverLetter, resumeFile);
        return new ResponseEntity<>(ApiResponse.success("Application submitted successfully", application), HttpStatus.CREATED);
    }

    @GetMapping("/applications")
    @Operation(summary = "List candidate job applications with status tracking")
    public ResponseEntity<ApiResponse<PagedResponse<ApplicationDto>>> getApplications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        PagedResponse<ApplicationDto> applications = applicationService.getCandidateApplications(candidateId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Applications retrieved", applications));
    }

    @GetMapping("/saved-jobs")
    @Operation(summary = "List saved bookmark jobs for candidate")
    public ResponseEntity<ApiResponse<PagedResponse<JobDto>>> getSavedJobs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        PagedResponse<JobDto> savedJobs = applicationService.getSavedJobs(candidateId, page, size);
        return ResponseEntity.ok(ApiResponse.success("Saved jobs retrieved", savedJobs));
    }

    @PostMapping("/saved-jobs/{jobId}")
    @Operation(summary = "Bookmark or save a job")
    public ResponseEntity<ApiResponse<Void>> saveJob(@PathVariable Long jobId) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        applicationService.saveJob(candidateId, jobId);
        return ResponseEntity.ok(ApiResponse.success("Job bookmarked"));
    }

    @DeleteMapping("/saved-jobs/{jobId}")
    @Operation(summary = "Remove a job bookmark")
    public ResponseEntity<ApiResponse<Void>> unsaveJob(@PathVariable Long jobId) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        applicationService.unsaveJob(candidateId, jobId);
        return ResponseEntity.ok(ApiResponse.success("Job removed from saved"));
    }

    @GetMapping("/search-history")
    @Operation(summary = "View candidate recent search terms stored in MongoDB")
    public ResponseEntity<ApiResponse<List<SearchHistoryDocument>>> getSearchHistory() {
        Long candidateId = SecurityUtils.getCurrentUserId();
        List<SearchHistoryDocument> history = searchHistoryService.getUserSearchHistory(candidateId);
        return ResponseEntity.ok(ApiResponse.success("Search history retrieved", history));
    }

    @GetMapping("/interview-feedback/{applicationId}")
    @Operation(summary = "View interview rounds and feedback for an application")
    public ResponseEntity<ApiResponse<List<InterviewFeedbackDocument>>> getInterviewFeedback(@PathVariable Long applicationId) {
        Long candidateId = SecurityUtils.getCurrentUserId();
        List<InterviewFeedbackDocument> feedback = interviewFeedbackService.getFeedbackForApplication(candidateId, applicationId);
        return ResponseEntity.ok(ApiResponse.success("Feedback retrieved", feedback));
    }
}
