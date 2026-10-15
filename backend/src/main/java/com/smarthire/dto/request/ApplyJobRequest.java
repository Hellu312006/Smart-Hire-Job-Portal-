package com.smarthire.dto.request;

public class ApplyJobRequest {
    private String coverLetter;
    private String resumePath;

    public ApplyJobRequest() {}

    public ApplyJobRequest(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getCoverLetter() { return coverLetter; }
    public void setCoverLetter(String coverLetter) { this.coverLetter = coverLetter; }
    public String getResumePath() { return resumePath; }
    public void setResumePath(String resumePath) { this.resumePath = resumePath; }
}
