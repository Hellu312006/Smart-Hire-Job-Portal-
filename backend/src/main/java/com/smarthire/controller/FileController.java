package com.smarthire.controller;

import com.smarthire.entity.Role;
import com.smarthire.security.SecurityUtils;
import com.smarthire.service.ApplicationService;
import com.smarthire.service.FileStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/files")
@Tag(name = "File Management", description = "Endpoints for downloading files, secure resume retrieval, and dynamic SVG placeholders")
public class FileController {

    private final FileStorageService fileStorageService;
    private final ApplicationService applicationService;

    public FileController(FileStorageService fileStorageService, ApplicationService applicationService) {
        this.fileStorageService = fileStorageService;
        this.applicationService = applicationService;
    }

    @GetMapping("/download/{subDir}/{filename:.+}")
    @Operation(summary = "Download or stream an uploaded file")
    public ResponseEntity<Resource> downloadFile(@PathVariable String subDir,
                                                @PathVariable String filename,
                                                HttpServletRequest request) {
        Resource resource = fileStorageService.loadFileAsResource(subDir + "/" + filename);

        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            // fallback
        }
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/applications/{applicationId}/resume")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Securely download an applicant's resume with strict role authorization")
    public ResponseEntity<Resource> downloadApplicantResume(@PathVariable Long applicationId) {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        Role currentUserRole = SecurityUtils.getCurrentUserRole();

        Resource resource = applicationService.getResumeResource(currentUserId, currentUserRole, applicationId);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"resume-" + applicationId + ".pdf\"")
                .body(resource);
    }

    @GetMapping(value = "/placeholder/avatar/{name}", produces = "image/svg+xml")
    @Operation(summary = "Generate dynamic high-resolution SVG profile avatar")
    public ResponseEntity<String> getAvatarPlaceholder(@PathVariable String name) {
        String svg = fileStorageService.generateAvatarSvg(name);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/svg+xml"))
                .body(svg);
    }

    @GetMapping(value = "/placeholder/logo/{companyName}", produces = "image/svg+xml")
    @Operation(summary = "Generate dynamic high-resolution SVG company brand logo")
    public ResponseEntity<String> getCompanyLogoPlaceholder(@PathVariable String companyName) {
        String svg = fileStorageService.generateCompanyLogoSvg(companyName);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType("image/svg+xml"))
                .body(svg);
    }
}
