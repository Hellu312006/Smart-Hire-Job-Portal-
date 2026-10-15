package com.smarthire.service;

import com.smarthire.document.InterviewFeedbackDocument;
import com.smarthire.dto.request.CreateInterviewFeedbackRequest;
import com.smarthire.entity.Application;
import com.smarthire.entity.User;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ForbiddenException;
import com.smarthire.exception.ResourceNotFoundException;
import com.smarthire.repository.ApplicationRepository;
import com.smarthire.repository.InterviewFeedbackRepository;
import com.smarthire.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class InterviewFeedbackService {

    private static final Logger logger = LoggerFactory.getLogger(InterviewFeedbackService.class);

    private final InterviewFeedbackRepository interviewFeedbackRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final ActivityLogService activityLogService;

    public InterviewFeedbackService(InterviewFeedbackRepository interviewFeedbackRepository,
                                    ApplicationRepository applicationRepository,
                                    UserRepository userRepository,
                                    ActivityLogService activityLogService) {
        this.interviewFeedbackRepository = interviewFeedbackRepository;
        this.applicationRepository = applicationRepository;
        this.userRepository = userRepository;
        this.activityLogService = activityLogService;
    }

    public InterviewFeedbackDocument addFeedback(Long recruiterId, CreateInterviewFeedbackRequest request) {
        Application application = applicationRepository.findById(request.getApplicationId())
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + request.getApplicationId()));

        User recruiter = userRepository.findById(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("Recruiter not found"));

        // Verify that this recruiter owns the job for this application
        if (!application.getJob().getCompany().getRecruiter().getId().equals(recruiterId)) {
            throw new ForbiddenException("You can only add feedback to candidates for jobs posted by your company");
        }

        InterviewFeedbackDocument feedback = new InterviewFeedbackDocument(
                application.getId(),
                recruiterId,
                recruiter.getFullName(),
                request.getInterviewRound(),
                request.getTopics(),
                request.getRating(),
                request.getFeedback()
        );

        try {
            InterviewFeedbackDocument saved = interviewFeedbackRepository.save(feedback);
            activityLogService.logActivity(recruiterId, recruiter.getEmail(), "ADD_FEEDBACK",
                    "Added interview feedback for application #" + application.getId(), "127.0.0.1");
            return saved;
        } catch (Exception ex) {
            logger.error("Failed to save interview feedback in MongoDB: {}", ex.getMessage());
            throw new BadRequestException("Could not store feedback in database: " + ex.getMessage());
        }
    }

    public List<InterviewFeedbackDocument> getFeedbackForApplication(Long userId, Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        // Authorized if: user is candidate, or recruiter of the job, or admin
        boolean isCandidate = application.getCandidate().getId().equals(userId);
        boolean isRecruiter = application.getJob().getCompany().getRecruiter().getId().equals(userId);

        if (!isCandidate && !isRecruiter) {
            throw new ForbiddenException("You are not authorized to view this interview feedback");
        }

        try {
            return interviewFeedbackRepository.findByApplicationIdOrderByCreatedAtDesc(applicationId);
        } catch (Exception ex) {
            logger.warn("Could not retrieve interview feedback from MongoDB: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }
}
