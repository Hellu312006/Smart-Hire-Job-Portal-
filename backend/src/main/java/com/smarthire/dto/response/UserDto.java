package com.smarthire.dto.response;

import com.smarthire.entity.Role;
import com.smarthire.entity.User;

public class UserDto {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private String profileImagePath;
    private boolean enabled;

    public UserDto() {}

    public UserDto(Long id, String fullName, String email, Role role, String profileImagePath, boolean enabled) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.profileImagePath = profileImagePath;
        this.enabled = enabled;
    }

    public static UserDto fromEntity(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                user.getRole(),
                user.getProfileImagePath(),
                user.isEnabled()
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public String getProfileImagePath() { return profileImagePath; }
    public void setProfileImagePath(String profileImagePath) { this.profileImagePath = profileImagePath; }
    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}
