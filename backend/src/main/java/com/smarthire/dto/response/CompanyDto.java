package com.smarthire.dto.response;

import com.smarthire.entity.Company;

public class CompanyDto {
    private Long id;
    private String name;
    private String description;
    private String website;
    private String industry;
    private String location;
    private String logoPath;
    private Long recruiterId;

    public CompanyDto() {}

    public CompanyDto(Long id, String name, String description, String website, String industry, String location, String logoPath, Long recruiterId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.website = website;
        this.industry = industry;
        this.location = location;
        this.logoPath = logoPath;
        this.recruiterId = recruiterId;
    }

    public static CompanyDto fromEntity(Company c) {
        if (c == null) return null;
        return new CompanyDto(
                c.getId(),
                c.getName(),
                c.getDescription(),
                c.getWebsite(),
                c.getIndustry(),
                c.getLocation(),
                c.getLogoPath(),
                c.getRecruiter() != null ? c.getRecruiter().getId() : null
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getLogoPath() { return logoPath; }
    public void setLogoPath(String logoPath) { this.logoPath = logoPath; }
    public Long getRecruiterId() { return recruiterId; }
    public void setRecruiterId(Long recruiterId) { this.recruiterId = recruiterId; }
}
