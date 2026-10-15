package com.smarthire;

import com.smarthire.exception.BadRequestException;
import com.smarthire.service.FileStorageService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

public class FileStorageServiceTest {

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp(@TempDir Path tempDir) {
        fileStorageService = new FileStorageService(tempDir.toString());
        fileStorageService.init();
    }

    @Test
    @DisplayName("Should successfully store valid profile image")
    void storeProfileImage_Success() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "avatar.png", "image/png", "fake-image-bytes".getBytes()
        );

        String path = fileStorageService.storeProfileImage(file);
        assertNotNull(path);
        assertTrue(path.startsWith("profiles/"));
        assertTrue(path.endsWith(".png"));
    }

    @Test
    @DisplayName("Should reject invalid image file types")
    void storeProfileImage_InvalidType_ThrowsException() {
        MockMultipartFile file = new MockMultipartFile(
                "file", "malicious.exe", "application/x-msdownload", "executable-bytes".getBytes()
        );

        assertThrows(BadRequestException.class, () -> fileStorageService.storeProfileImage(file));
    }

    @Test
    @DisplayName("Should generate valid SVG avatar with initials")
    void generateAvatarSvg_Success() {
        String svg = fileStorageService.generateAvatarSvg("Alex Mercer");
        assertNotNull(svg);
        assertTrue(svg.contains("<svg"));
        assertTrue(svg.contains("AM"));
    }

    @Test
    @DisplayName("Should generate valid SVG company logo with initial")
    void generateCompanyLogoSvg_Success() {
        String svg = fileStorageService.generateCompanyLogoSvg("TechCorp Solutions");
        assertNotNull(svg);
        assertTrue(svg.contains("<svg"));
        assertTrue(svg.contains("T"));
    }
}
