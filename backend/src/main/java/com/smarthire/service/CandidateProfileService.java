package com.smarthire.service;

import com.smarthire.document.CandidateProfileDocument;
import com.smarthire.dto.request.ExtendedProfileRequest;
import com.smarthire.entity.Role;
import com.smarthire.entity.User;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ResourceNotFoundException;
import com.smarthire.repository.CandidateProfileRepository;
import com.smarthire.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class CandidateProfileService {

    private static final Logger logger = LoggerFactory.getLogger(CandidateProfileService.class);

    private final CandidateProfileRepository candidateProfileRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final ActivityLogService activityLogService;

    public CandidateProfileService(CandidateProfileRepository candidateProfileRepository,
                                  UserRepository userRepository,
                                  FileStorageService fileStorageService,
                                  ActivityLogService activityLogService) {
        this.candidateProfileRepository = candidateProfileRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
        this.activityLogService = activityLogService;
    }

    public CandidateProfileDocument getProfileByUserId(Long userId) {
        try {
            return candidateProfileRepository.findByUserId(userId)
                    .orElseGet(() -> {
                        CandidateProfileDocument newDoc = new CandidateProfileDocument(userId, "Passionate Professional", new ArrayList<>());
                        return candidateProfileRepository.save(newDoc);
                    });
        } catch (Exception ex) {
            logger.warn("MongoDB unavailable when retrieving candidate profile: {}", ex.getMessage());
            CandidateProfileDocument fallback = new CandidateProfileDocument(userId, "Passionate Professional", new ArrayList<>());
            return fallback;
        }
    }

    public CandidateProfileDocument updateExtendedProfile(Long userId, ExtendedProfileRequest request) {
        CandidateProfileDocument profile = getProfileByUserId(userId);

        if (request.getHeadline() != null) profile.setHeadline(request.getHeadline());
        if (request.getSkills() != null) profile.setSkills(request.getSkills());
        if (request.getEducation() != null) profile.setEducation(request.getEducation());
        if (request.getExperience() != null) profile.setExperience(request.getExperience());
        if (request.getProjects() != null) profile.setProjects(request.getProjects());
        if (request.getCertifications() != null) profile.setCertifications(request.getCertifications());
        if (request.getPreferredLocations() != null) profile.setPreferredLocations(request.getPreferredLocations());
        if (request.getPreferredEmploymentTypes() != null) profile.setPreferredEmploymentTypes(request.getPreferredEmploymentTypes());
        profile.setUpdatedAt(LocalDateTime.now());

        try {
            CandidateProfileDocument saved = candidateProfileRepository.save(profile);
            activityLogService.logActivity(userId, "", "UPDATE_PROFILE", "Updated extended profile sections", "127.0.0.1");
            return saved;
        } catch (Exception ex) {
            logger.error("Failed to update MongoDB candidate profile: {}", ex.getMessage());
            return profile;
        }
    }

    @Transactional
    public String uploadProfilePhoto(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        String filePath = fileStorageService.storeProfileImage(file);
        user.setProfileImagePath(filePath);
        userRepository.save(user);

        activityLogService.logActivity(userId, user.getEmail(), "UPLOAD_PHOTO", "Updated profile photo: " + filePath, "127.0.0.1");
        return filePath;
    }

    public String uploadResume(Long userId, MultipartFile file) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (user.getRole() != Role.CANDIDATE) {
            throw new BadRequestException("Only candidates can upload resumes");
        }

        String filePath = fileStorageService.storeResume(file);

        try {
            CandidateProfileDocument profile = getProfileByUserId(userId);
            Map<String, Object> meta = profile.getResumeMetadata() != null ? profile.getResumeMetadata() : new HashMap<>();
            meta.put("fileName", file.getOriginalFilename());
            meta.put("filePath", filePath);
            meta.put("fileSize", file.getSize());
            meta.put("contentType", file.getContentType());
            meta.put("uploadedAt", LocalDateTime.now().toString());
            profile.setResumeMetadata(meta);
            candidateProfileRepository.save(profile);
        } catch (Exception ex) {
            logger.warn("Could not save resume metadata in MongoDB: {}", ex.getMessage());
        }

        activityLogService.logActivity(userId, user.getEmail(), "UPLOAD_RESUME", "Uploaded resume: " + file.getOriginalFilename(), "127.0.0.1");
        return filePath;
    }

    public List<Map> getTopSkills() {
        try {
            return candidateProfileRepository.findTopSkills();
        } catch (Exception ex) {
            logger.warn("Could not aggregate skills: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }
}
