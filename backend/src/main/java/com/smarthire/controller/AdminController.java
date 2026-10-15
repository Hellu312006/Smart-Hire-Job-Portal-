package com.smarthire.controller;

import com.smarthire.document.ActivityLogDocument;
import com.smarthire.dto.response.*;
import com.smarthire.security.SecurityUtils;
import com.smarthire.service.ActivityLogService;
import com.smarthire.service.CompanyService;
import com.smarthire.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Administrator", description = "Platform management, user accounts, system activity, and company supervision")
public class AdminController {

    private final DashboardService dashboardService;
    private final CompanyService companyService;
    private final ActivityLogService activityLogService;

    public AdminController(DashboardService dashboardService,
                           CompanyService companyService,
                           ActivityLogService activityLogService) {
        this.dashboardService = dashboardService;
        this.companyService = companyService;
        this.activityLogService = activityLogService;
    }

    @GetMapping("/dashboard")
    @Operation(summary = "Get platform-wide overview metrics and recent activity")
    public ResponseEntity<ApiResponse<AdminDashboardDto>> getDashboard() {
        AdminDashboardDto dashboard = dashboardService.getAdminDashboard();
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard loaded", dashboard));
    }

    @GetMapping("/users")
    @Operation(summary = "List all platform users with pagination")
    public ResponseEntity<ApiResponse<PagedResponse<UserDto>>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        PagedResponse<UserDto> users = dashboardService.getAllUsers(page, size);
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }

    @PatchMapping("/users/{userId}/toggle-status")
    @Operation(summary = "Suspend or reactivate a user account")
    public ResponseEntity<ApiResponse<UserDto>> toggleUserStatus(@PathVariable Long userId) {
        Long adminId = SecurityUtils.getCurrentUserId();
        UserDto user = dashboardService.toggleUserStatus(adminId, userId);
        return ResponseEntity.ok(ApiResponse.success("User account status toggled", user));
    }

    @GetMapping("/companies")
    @Operation(summary = "List all registered companies")
    public ResponseEntity<ApiResponse<Page<CompanyDto>>> getCompanies(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size) {
        Page<CompanyDto> companies = companyService.getCompaniesPaged(PageRequest.of(page, size, Sort.by("name").ascending()));
        return ResponseEntity.ok(ApiResponse.success("Companies retrieved", companies));
    }

    @GetMapping("/logs")
    @Operation(summary = "View system activity logs from MongoDB")
    public ResponseEntity<ApiResponse<Page<ActivityLogDocument>>> getActivityLogs(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Page<ActivityLogDocument> logs = activityLogService.getAllLogs(page, size);
        return ResponseEntity.ok(ApiResponse.success("Activity logs retrieved", logs));
    }
}
