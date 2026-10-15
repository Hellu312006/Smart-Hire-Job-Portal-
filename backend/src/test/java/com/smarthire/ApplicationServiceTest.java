package com.smarthire;

import com.smarthire.dto.request.UpdateApplicationStatusRequest;
import com.smarthire.dto.response.ApplicationDto;
import com.smarthire.entity.*;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ForbiddenException;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.SavedJobRepository;
import com.smarthire.repository.UserRepository;
import com.smarthire.service.ActivityLogService;
import com.smarthire.service.ApplicationService;
import com.smarthire.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ApplicationServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private SavedJobRepository savedJobRepository;

    @Mock
    private FileStorageService fileStorageService;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private ApplicationService applicationService;

    private User candidate;
    private User recruiter;
    private Company company;
    private Job activeJob;
    private Application application;

    @BeforeEach
    void setUp() {
        candidate = new User("Alex Mercer", "alex@example.com", "pass", Role.CANDIDATE);
        candidate.setId(10L);

        recruiter = new User("Sarah Jenkins", "sarah@techcorp.com", "pass", Role.RECRUITER);
        recruiter.setId(20L);

        company = new Company("TechCorp", "IT SaaS", "https://techcorp.com", "IT", "SF", recruiter);
        company.setId(100L);

        activeJob = new Job();
        activeJob.setId(500L);
        activeJob.setTitle("Java Developer");
        activeJob.setCompany(company);
        activeJob.setStatus(JobStatus.ACTIVE);

        application = new Application(activeJob, candidate, null, "Cover letter text");
        application.setId(1000L);
        application.setStatus(ApplicationStatus.APPLIED);
    }

    @Test
    @DisplayName("Should allow candidate to submit application successfully")
    void applyForJob_Success() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(jobRepository.findById(500L)).thenReturn(Optional.of(activeJob));
        when(applicationRepository.existsByJobIdAndCandidateId(500L, 10L)).thenReturn(false);
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        ApplicationDto dto = applicationService.applyForJob(10L, 500L, "Cover letter text", null);

        assertNotNull(dto);
        assertEquals(ApplicationStatus.APPLIED, dto.getStatus());
        assertEquals("Java Developer", dto.getJobTitle());
        verify(applicationRepository, times(1)).save(any(Application.class));
    }

    @Test
    @DisplayName("Should prevent candidate from applying twice to the same job (duplicate prevention)")
    void applyForJob_DuplicateApplication_ThrowsBadRequestException() {
        when(userRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(jobRepository.findById(500L)).thenReturn(Optional.of(activeJob));
        when(applicationRepository.existsByJobIdAndCandidateId(500L, 10L)).thenReturn(true);

        assertThrows(BadRequestException.class, () ->
                applicationService.applyForJob(10L, 500L, "Duplicate application", null)
        );
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should prevent application to closed jobs")
    void applyForJob_ClosedJob_ThrowsBadRequestException() {
        activeJob.setStatus(JobStatus.CLOSED);

        when(userRepository.findById(10L)).thenReturn(Optional.of(candidate));
        when(jobRepository.findById(500L)).thenReturn(Optional.of(activeJob));

        assertThrows(BadRequestException.class, () ->
                applicationService.applyForJob(10L, 500L, "Apply to closed job", null)
        );
        verify(applicationRepository, never()).save(any(Application.class));
    }

    @Test
    @DisplayName("Should allow job-owning recruiter to update application status")
    void updateApplicationStatus_Success() {
        UpdateApplicationStatusRequest request = new UpdateApplicationStatusRequest(ApplicationStatus.SHORTLISTED);

        when(applicationRepository.findById(1000L)).thenReturn(Optional.of(application));
        when(applicationRepository.save(any(Application.class))).thenReturn(application);

        ApplicationDto updated = applicationService.updateApplicationStatus(20L, 1000L, request);

        assertNotNull(updated);
        assertEquals(ApplicationStatus.SHORTLISTED, application.getStatus());
        verify(applicationRepository, times(1)).save(application);
    }

    @Test
    @DisplayName("Should forbid other recruiters from changing candidate application status")
    void updateApplicationStatus_UnauthorizedRecruiter_ThrowsForbiddenException() {
        UpdateApplicationStatusRequest request = new UpdateApplicationStatusRequest(ApplicationStatus.REJECTED);

        when(applicationRepository.findById(1000L)).thenReturn(Optional.of(application));

        // Recruiter ID 999 tries to update Recruiter 20's applicant
        assertThrows(ForbiddenException.class, () ->
                applicationService.updateApplicationStatus(999L, 1000L, request)
        );
        verify(applicationRepository, never()).save(any(Application.class));
    }
}
