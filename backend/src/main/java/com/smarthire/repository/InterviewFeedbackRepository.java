package com.smarthire.repository;

import com.smarthire.document.InterviewFeedbackDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewFeedbackRepository extends MongoRepository<InterviewFeedbackDocument, String> {
    List<InterviewFeedbackDocument> findByApplicationIdOrderByCreatedAtDesc(Long applicationId);
    List<InterviewFeedbackDocument> findByReviewerIdOrderByCreatedAtDesc(Long reviewerId);
}
