package com.smarthire.controller;

import com.smarthire.dto.request.LoginRequest;
import com.smarthire.dto.request.RegisterCandidateRequest;
import com.smarthire.dto.request.RegisterRecruiterRequest;
import com.smarthire.dto.response.ApiResponse;
import com.smarthire.dto.response.AuthResponse;
import com.smarthire.dto.response.UserDto;
import com.smarthire.security.SecurityUtils;
import com.smarthire.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for candidate and recruiter registration, login, and user profile")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register/candidate")
    @Operation(summary = "Register a new candidate account")
    public ResponseEntity<ApiResponse<AuthResponse>> registerCandidate(@Valid @RequestBody RegisterCandidateRequest request) {
        AuthResponse response = authService.registerCandidate(request);
        return new ResponseEntity<>(ApiResponse.success("Candidate registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/register/recruiter")
    @Operation(summary = "Register a new recruiter and create corporate profile")
    public ResponseEntity<ApiResponse<AuthResponse>> registerRecruiter(@Valid @RequestBody RegisterRecruiterRequest request) {
        AuthResponse response = authService.registerRecruiter(request);
        return new ResponseEntity<>(ApiResponse.success("Recruiter registered successfully", response), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT bearer token")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success("Login successful", response));
    }

    @GetMapping("/me")
    @Operation(summary = "Retrieve current authenticated user session details")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        UserDto user = authService.getCurrentUser(currentUserId);
        return ResponseEntity.ok(ApiResponse.success("User profile retrieved", user));
    }
}
