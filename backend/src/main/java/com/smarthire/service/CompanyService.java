package com.smarthire.service;

import com.smarthire.dto.response.CompanyDto;
import com.smarthire.entity.Company;
import com.smarthire.entity.User;
import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ResourceNotFoundException;
import com.smarthire.repository.CompanyRepository;
import com.smarthire.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;

    public CompanyService(CompanyRepository companyRepository,
                          UserRepository userRepository,
                          FileStorageService fileStorageService) {
        this.companyRepository = companyRepository;
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public CompanyDto getCompanyById(Long id) {
        Company company = companyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + id));
        return CompanyDto.fromEntity(company);
    }

    public CompanyDto getCompanyByRecruiterId(Long recruiterId) {
        Company company = companyRepository.findByRecruiterId(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("No company associated with recruiter id: " + recruiterId));
        return CompanyDto.fromEntity(company);
    }

    public Company getCompanyEntityByRecruiterId(Long recruiterId) {
        return companyRepository.findByRecruiterId(recruiterId)
                .orElseThrow(() -> new ResourceNotFoundException("No company profile found for recruiter"));
    }

    @Transactional
    public CompanyDto updateCompanyProfile(Long recruiterId, CompanyDto dto) {
        Company company = getCompanyEntityByRecruiterId(recruiterId);
        if (dto.getName() != null) company.setName(dto.getName());
        if (dto.getDescription() != null) company.setDescription(dto.getDescription());
        if (dto.getWebsite() != null) company.setWebsite(dto.getWebsite());
        if (dto.getIndustry() != null) company.setIndustry(dto.getIndustry());
        if (dto.getLocation() != null) company.setLocation(dto.getLocation());

        return CompanyDto.fromEntity(companyRepository.save(company));
    }

    @Transactional
    public String uploadCompanyLogo(Long recruiterId, MultipartFile file) {
        Company company = getCompanyEntityByRecruiterId(recruiterId);
        String logoPath = fileStorageService.storeCompanyLogo(file);
        company.setLogoPath(logoPath);
        companyRepository.save(company);
        return logoPath;
    }

    public List<CompanyDto> getAllCompanies() {
        return companyRepository.findAll().stream()
                .map(CompanyDto::fromEntity)
                .collect(Collectors.toList());
    }

    public Page<CompanyDto> getCompaniesPaged(Pageable pageable) {
        return companyRepository.findAll(pageable).map(CompanyDto::fromEntity);
    }
}
