package com.smarthire;

import com.smarthire.dto.request.LoginRequest;
import com.smarthire.dto.request.RegisterCandidateRequest;
import com.smarthire.dto.request.RegisterRecruiterRequest;
import com.smarthire.dto.response.AuthResponse;
import com.smarthire.entity.Company;
import com.smarthire.entity.Role;
import com.smarthire.entity.User;
import com.smarthire.exception.BadRequestException;
import com.smarthire.repository.CandidateProfileRepository;
import com.smarthire.repository.CompanyRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.security.JwtTokenProvider;
import com.smarthire.service.ActivityLogService;
import com.smarthire.service.AuthService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private CandidateProfileRepository candidateProfileRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private AuthService authService;

    private User sampleCandidate;

    @BeforeEach
    void setUp() {
        sampleCandidate = new User("Alex Mercer", "alex@example.com", "encodedPass", Role.CANDIDATE);
        sampleCandidate.setId(10L);
    }

    @Test
    @DisplayName("Should successfully register a new candidate")
    void registerCandidate_Success() {
        RegisterCandidateRequest request = new RegisterCandidateRequest();
        request.setFullName("Alex Mercer");
        request.setEmail("alex@example.com");
        request.setPassword("password123");
        request.setHeadline("Software Engineer");

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(sampleCandidate);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock-jwt-token");

        AuthResponse response = authService.registerCandidate(request);

        assertNotNull(response);
        assertEquals("mock-jwt-token", response.getToken());
        assertEquals("Alex Mercer", response.getUser().getFullName());
        assertEquals(Role.CANDIDATE, response.getUser().getRole());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    @DisplayName("Should throw BadRequestException on duplicate email registration")
    void registerCandidate_DuplicateEmail_ThrowsException() {
        RegisterCandidateRequest request = new RegisterCandidateRequest();
        request.setFullName("Duplicate User");
        request.setEmail("alex@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail("alex@example.com")).thenReturn(true);

        assertThrows(BadRequestException.class, () -> authService.registerCandidate(request));
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    @DisplayName("Should successfully register a recruiter and create company profile")
    void registerRecruiter_Success() {
        RegisterRecruiterRequest request = new RegisterRecruiterRequest();
        request.setFullName("Sarah Jenkins");
        request.setEmail("sarah@techcorp.com");
        request.setPassword("password123");
        request.setCompanyName("TechCorp");
        request.setCompanyWebsite("https://techcorp.com");
        request.setIndustry("Technology");

        User recruiter = new User("Sarah Jenkins", "sarah@techcorp.com", "encodedPass", Role.RECRUITER);
        recruiter.setId(20L);

        when(userRepository.existsByEmail("sarah@techcorp.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encodedPass");
        when(userRepository.save(any(User.class))).thenReturn(recruiter);

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("mock-recruiter-token");

        AuthResponse response = authService.registerRecruiter(request);

        assertNotNull(response);
        assertEquals("mock-recruiter-token", response.getToken());
        assertEquals(Role.RECRUITER, response.getUser().getRole());
        verify(companyRepository, times(1)).save(any(Company.class));
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void login_Success() {
        LoginRequest request = new LoginRequest("alex@example.com", "password123");

        Authentication auth = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("login-jwt-token");
        when(userRepository.findByEmail("alex@example.com")).thenReturn(Optional.of(sampleCandidate));

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("login-jwt-token", response.getToken());
        assertEquals("alex@example.com", response.getUser().getEmail());
    }
}
