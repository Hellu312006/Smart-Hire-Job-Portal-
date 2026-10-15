package com.smarthire;

import com.smarthire.dto.request.CreateJobRequest;
import com.smarthire.dto.request.UpdateJobRequest;
import com.smarthire.dto.response.JobDto;
import com.smarthire.entity.*;
import com.smarthire.exception.ForbiddenException;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.CompanyRepository;
import com.smarthire.repository.JobRepository;
import com.smarthire.repository.SavedJobRepository;
import com.smarthire.service.ActivityLogService;
import com.smarthire.service.JobService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CompanyRepository companyRepository;

    @Mock
    private SavedJobRepository savedJobRepository;

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private ActivityLogService activityLogService;

    @InjectMocks
    private JobService jobService;

    private User recruiter1;
    private User recruiter2;
    private Company company1;
    private Job job1;

    @BeforeEach
    void setUp() {
        recruiter1 = new User("Sarah Jenkins", "sarah@techcorp.com", "pass", Role.RECRUITER);
        recruiter1.setId(1L);

        recruiter2 = new User("Other Recruiter", "other@corp.com", "pass", Role.RECRUITER);
        recruiter2.setId(2L);

        company1 = new Company("TechCorp", "Tech SaaS", "https://techcorp.com", "IT", "SF", recruiter1);
        company1.setId(10L);

        job1 = new Job();
        job1.setId(100L);
        job1.setCompany(company1);
        job1.setTitle("Backend Java Developer");
        job1.setDescription("Build APIs with Spring Boot");
        job1.setLocation("Remote");
        job1.setMinSalary(new BigDecimal("90000"));
        job1.setMaxSalary(new BigDecimal("120000"));
        job1.setEmploymentType(EmploymentType.FULL_TIME);
        job1.setExperienceLevel(ExperienceLevel.MID);
        job1.setStatus(JobStatus.ACTIVE);
    }

    @Test
    @DisplayName("Should successfully create a job opening for recruiter")
    void createJob_Success() {
        CreateJobRequest request = new CreateJobRequest();
        request.setTitle("Backend Java Developer");
        request.setDescription("Build APIs with Spring Boot");
        request.setLocation("Remote");
        request.setMinSalary(new BigDecimal("90000"));
        request.setMaxSalary(new BigDecimal("120000"));
        request.setEmploymentType(EmploymentType.FULL_TIME);
        request.setExperienceLevel(ExperienceLevel.MID);

        when(companyRepository.findByRecruiterId(1L)).thenReturn(Optional.of(company1));
        when(jobRepository.save(any(Job.class))).thenReturn(job1);

        JobDto result = jobService.createJob(1L, request);

        assertNotNull(result);
        assertEquals("Backend Java Developer", result.getTitle());
        assertEquals("TechCorp", result.getCompanyName());
        verify(jobRepository, times(1)).save(any(Job.class));
    }

    @Test
    @DisplayName("Should update job when called by the job owner recruiter")
    void updateJob_Success() {
        UpdateJobRequest request = new UpdateJobRequest();
        request.setTitle("Senior Backend Java Developer");
        request.setDescription("Updated description");
        request.setLocation("San Francisco, CA");
        request.setMinSalary(new BigDecimal("110000"));
        request.setMaxSalary(new BigDecimal("140000"));
        request.setEmploymentType(EmploymentType.FULL_TIME);
        request.setExperienceLevel(ExperienceLevel.SENIOR);

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job1));
        when(jobRepository.save(any(Job.class))).thenReturn(job1);

        JobDto updated = jobService.updateJob(1L, 100L, request);

        assertNotNull(updated);
        verify(jobRepository, times(1)).save(job1);
    }

    @Test
    @DisplayName("Should throw ForbiddenException when updating a job belonging to another company")
    void updateJob_UnauthorizedRecruiter_ThrowsForbiddenException() {
        UpdateJobRequest request = new UpdateJobRequest();
        request.setTitle("Attempted takeover");

        when(jobRepository.findById(100L)).thenReturn(Optional.of(job1));

        // Recruiter 2 tries to update Recruiter 1's job
        assertThrows(ForbiddenException.class, () -> jobService.updateJob(2L, 100L, request));
        verify(jobRepository, never()).save(any(Job.class));
    }

    @Test
    @DisplayName("Should allow Admin to delete any job listing")
    void deleteJob_Admin_Success() {
        when(jobRepository.findById(100L)).thenReturn(Optional.of(job1));

        jobService.deleteJob(999L, Role.ADMIN, 100L);

        verify(jobRepository, times(1)).delete(job1);
    }
}
