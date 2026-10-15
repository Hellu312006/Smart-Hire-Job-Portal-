package com.smarthire.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Document(collection = "interview_feedback")
public class InterviewFeedbackDocument {

    @Id
    private String id;

    @Indexed
    private Long applicationId;

    private Long reviewerId;
    private String reviewerName;
    private String interviewRound;
    private List<String> topics = new ArrayList<>();
    private int rating; // 1 to 5
    private String feedback;
    private LocalDateTime createdAt;

    public InterviewFeedbackDocument() {
        this.createdAt = LocalDateTime.now();
    }

    public InterviewFeedbackDocument(Long applicationId, Long reviewerId, String reviewerName, 
                                     String interviewRound, List<String> topics, int rating, String feedback) {
        this.applicationId = applicationId;
        this.reviewerId = reviewerId;
        this.reviewerName = reviewerName;
        this.interviewRound = interviewRound;
        this.topics = topics != null ? topics : new ArrayList<>();
        this.rating = rating;
        this.feedback = feedback;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getApplicationId() { return applicationId; }
    public void setApplicationId(Long applicationId) { this.applicationId = applicationId; }
    public Long getReviewerId() { return reviewerId; }
    public void setReviewerId(Long reviewerId) { this.reviewerId = reviewerId; }
    public String getReviewerName() { return reviewerName; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }
    public String getInterviewRound() { return interviewRound; }
    public void setInterviewRound(String interviewRound) { this.interviewRound = interviewRound; }
    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }
    public int getRating() { return rating; }
    public void setRating(int rating) { this.rating = rating; }
    public String getFeedback() { return feedback; }
    public void setFeedback(String feedback) { this.feedback = feedback; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
