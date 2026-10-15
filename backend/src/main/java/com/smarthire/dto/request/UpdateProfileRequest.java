package com.smarthire.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class UpdateProfileRequest {

    @NotBlank(message = "Full name cannot be blank")
    @Size(min = 2, max = 150)
    private String fullName;

    private String profileImagePath;

    public UpdateProfileRequest() {}

    public UpdateProfileRequest(String fullName, String profileImagePath) {
        this.fullName = fullName;
        this.profileImagePath = profileImagePath;
    }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getProfileImagePath() { return profileImagePath; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }
}
