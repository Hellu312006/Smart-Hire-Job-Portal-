package com.smarthire.service;

import com.smarthire.document.CandidateProfileDocument;
import com.smarthire.dto.request.LoginRequest;
import com.smarthire.dto.request.RegisterCandidateRequest;
import com.smarthire.dto.request.RegisterRecruiterRequest;
import com.smarthire.dto.response.AuthResponse;
import com.smarthire.dto.response.UserDto;
import com.smarthire.entity.Company;
import com.smarthire.entity.Role;
import com.smarthire.entity.User;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ResourceNotFoundException;
import com.smarthire.repository.CandidateProfileRepository;
import com.smarthire.repository.CompanyRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyRepository companyRepository;
    private final CandidateProfileRepository candidateProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;
    private final ActivityLogService activityLogService;

    public AuthService(UserRepository userRepository,
                       CompanyRepository companyRepository,
                       CandidateProfileRepository candidateProfileRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       JwtTokenProvider tokenProvider,
                       ActivityLogService activityLogService) {
        this.userRepository = userRepository;
        this.companyRepository = companyRepository;
        this.candidateProfileRepository = candidateProfileRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public AuthResponse registerCandidate(RegisterCandidateRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email address already exists");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                Role.CANDIDATE
        );
        User savedUser = userRepository.save(user);

        // Seed MongoDB Candidate Profile Document
        try {
            CandidateProfileDocument profile = new CandidateProfileDocument(
                    savedUser.getId(),
                    request.getHeadline() != null ? request.getHeadline() : "Job Seeker",
                    new ArrayList<>()
            );
            if (request.getLocation() != null && !request.getLocation().isBlank()) {
                profile.getPreferredLocations().add(request.getLocation());
            }
            candidateProfileRepository.save(profile);
        } catch (Exception ex) {
            // MongoDB non-blocking failure
        }

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        activityLogService.logActivity(savedUser.getId(), savedUser.getEmail(), "REGISTER_CANDIDATE",
                "New candidate registered: " + savedUser.getFullName(), "127.0.0.1");

        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    @Transactional
    public AuthResponse registerRecruiter(RegisterRecruiterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("An account with this email address already exists");
        }

        User user = new User(
                request.getFullName(),
                request.getEmail().toLowerCase().trim(),
                passwordEncoder.encode(request.getPassword()),
                Role.RECRUITER
        );
        User savedUser = userRepository.save(user);

        // Create Company linked to this recruiter
        Company company = new Company(
                request.getCompanyName(),
                request.getCompanyDescription(),
                request.getCompanyWebsite(),
                request.getIndustry(),
                request.getCompanyLocation(),
                savedUser
        );
        companyRepository.save(company);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        activityLogService.logActivity(savedUser.getId(), savedUser.getEmail(), "REGISTER_RECRUITER",
                "New recruiter registered for company: " + request.getCompanyName(), "127.0.0.1");

        return new AuthResponse(token, UserDto.fromEntity(savedUser));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase().trim(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail().toLowerCase().trim())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isEnabled()) {
            throw new BadRequestException("Your account has been deactivated. Please contact support.");
        }

        activityLogService.logActivity(user.getId(), user.getEmail(), "LOGIN", "User logged in", "127.0.0.1");

        return new AuthResponse(token, UserDto.fromEntity(user));
    }

    public UserDto getCurrentUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return UserDto.fromEntity(user);
    }
}
