package com.smarthire.service;

import com.smarthire.exception.BadRequestException;
import com.smarthire.exception.ResourceNotFoundException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path rootLocation;
    private final List<String> allowedImageTypes = Arrays.asList("image/jpeg", "image/png", "image/webp");
    private final List<String> allowedDocTypes = Arrays.asList("application/pdf");

    public FileStorageService(@Value("${smarthire.upload.dir:./uploads}") String uploadDir) {
        this.rootLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(rootLocation.resolve("profiles"));
            Files.createDirectories(rootLocation.resolve("logos"));
            Files.createDirectories(rootLocation.resolve("resumes"));
        } catch (IOException e) {
            throw new RuntimeException("Could not initialize storage folder: " + rootLocation, e);
        }
    }

    public String storeProfileImage(MultipartFile file) {
        validateFile(file, allowedImageTypes, 5 * 1024 * 1024, "Image (JPEG, PNG, WebP)");
        return storeFile(file, "profiles");
    }

    public String storeCompanyLogo(MultipartFile file) {
        validateFile(file, allowedImageTypes, 5 * 1024 * 1024, "Company Logo (JPEG, PNG, WebP)");
        return storeFile(file, "logos");
    }

    public String storeResume(MultipartFile file) {
        validateFile(file, allowedDocTypes, 10 * 1024 * 1024, "Resume PDF");
        return storeFile(file, "resumes");
    }

    private String storeFile(MultipartFile file, String subDir) {
        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "file");
        String extension = "";
        int dotIndex = originalFilename.lastIndexOf('.');
        if (dotIndex >= 0) {
            extension = originalFilename.substring(dotIndex);
        }

        String filename = UUID.randomUUID().toString() + extension;
        try {
            Path targetLocation = rootLocation.resolve(subDir).resolve(filename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);
            return subDir + "/" + filename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to store file: " + originalFilename, e);
        }
    }

    private void validateFile(MultipartFile file, List<String> allowedMimeTypes, long maxSizeBytes, String typeDescription) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Uploaded file cannot be empty");
        }

        if (file.getSize() > maxSizeBytes) {
            throw new BadRequestException("File size exceeds maximum permitted limit for " + typeDescription);
        }

        String contentType = file.getContentType();
        if (contentType == null || !allowedMimeTypes.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type. Allowed formats for " + typeDescription + " are: " + allowedMimeTypes);
        }
    }

    public Resource loadFileAsResource(String relativePath) {
        try {
            Path filePath = rootLocation.resolve(relativePath).normalize();
            if (!filePath.startsWith(rootLocation)) {
                throw new BadRequestException("Cannot access files outside the storage directory");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found: " + relativePath);
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + relativePath);
        }
    }

    public String generateAvatarSvg(String name) {
        String initials = "SH";
        if (StringUtils.hasText(name)) {
            String[] parts = name.trim().split("\\s+");
            if (parts.length == 1) {
                initials = parts[0].substring(0, Math.min(2, parts[0].length())).toUpperCase();
            } else if (parts.length > 1) {
                initials = ("" + parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
            }
        }

        // Professional Navy Gradient SVG Avatar
        return String.format(
            "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\" viewBox=\"0 0 128 128\">" +
            "<defs><linearGradient id=\"grad\" x1=\"0%%\" y1=\"0%%\" x2=\"100%%\" y2=\"100%%\">" +
            "<stop offset=\"0%%\" stop-color=\"#1E3A8A\" />" +
            "<stop offset=\"100%%\" stop-color=\"#2563EB\" />" +
            "</linearGradient></defs>" +
            "<rect width=\"128\" height=\"128\" rx=\"64\" fill=\"url(#grad)\" />" +
            "<text x=\"50%%\" y=\"54%%\" font-family=\"'Segoe UI', Inter, sans-serif\" font-size=\"44\" font-weight=\"bold\" fill=\"#FFFFFF\" text-anchor=\"middle\" dominant-baseline=\"middle\">%s</text>" +
            "</svg>", initials
        );
    }

    public String generateCompanyLogoSvg(String companyName) {
        String letter = "C";
        if (StringUtils.hasText(companyName)) {
            letter = ("" + companyName.trim().charAt(0)).toUpperCase();
        }

        // Modern Slate-Blue Corporate Logo Placeholder
        return String.format(
            "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"128\" height=\"128\" viewBox=\"0 0 128 128\">" +
            "<defs><linearGradient id=\"compGrad\" x1=\"0%%\" y1=\"0%%\" x2=\"100%%\" y2=\"100%%\">" +
            "<stop offset=\"0%%\" stop-color=\"#0F172A\" />" +
            "<stop offset=\"100%%\" stop-color=\"#334155\" />" +
            "</linearGradient></defs>" +
            "<rect width=\"128\" height=\"128\" rx=\"24\" fill=\"url(#compGrad)\" />" +
            "<text x=\"50%%\" y=\"54%%\" font-family=\"'Segoe UI', Inter, sans-serif\" font-size=\"50\" font-weight=\"bold\" fill=\"#38BDF8\" text-anchor=\"middle\" dominant-baseline=\"middle\">%s</text>" +
            "</svg>", letter
        );
    }
}
