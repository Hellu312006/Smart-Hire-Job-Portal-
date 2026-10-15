package com.smarthire.service;

import com.smarthire.document.ActivityLogDocument;
import com.smarthire.repository.ActivityLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class ActivityLogService {

    private static final Logger logger = LoggerFactory.getLogger(ActivityLogService.class);

    private final ActivityLogRepository activityLogRepository;

    public ActivityLogService(ActivityLogRepository activityLogRepository) {
        this.activityLogRepository = activityLogRepository;
    }

    @Async
    public void logActivity(Long userId, String email, String action, String details, String ipAddress) {
        try {
            ActivityLogDocument log = new ActivityLogDocument(userId, email, action, details, ipAddress);
            activityLogRepository.save(log);
        } catch (Exception ex) {
            logger.warn("Failed to write activity log to MongoDB: {}", ex.getMessage());
        }
    }

    public List<ActivityLogDocument> getRecentLogs() {
        try {
            return activityLogRepository.findTop20ByOrderByTimestampDesc();
        } catch (Exception ex) {
            logger.warn("Could not retrieve activity logs from MongoDB: {}", ex.getMessage());
            return Collections.emptyList();
        }
    }

    public Page<ActivityLogDocument> getAllLogs(int page, int size) {
        try {
            return activityLogRepository.findAllByOrderByTimestampDesc(PageRequest.of(page, size));
        } catch (Exception ex) {
            logger.warn("Could not retrieve activity logs page: {}", ex.getMessage());
            return Page.empty();
        }
    }
}
