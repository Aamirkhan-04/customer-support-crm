package com.datastraw.crm.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.datastraw.crm.exception.FileStorageException;
import com.datastraw.crm.exception.FileValidationException;

@Component
public class FileStorageService {

    @Value("${app.upload.dir}")
    private String uploadDir;

    public String saveFile(MultipartFile file) {

        try {

            Path uploadPath = Paths.get(uploadDir);

            Files.createDirectories(uploadPath);

            String fileName =
                    UUID.randomUUID() + "_" + file.getOriginalFilename();

            Path filePath =
                    uploadPath.resolve(fileName);

            Files.copy(
                    file.getInputStream(),
                    filePath);

            return fileName;

        } catch (IOException e) {

            throw new FileStorageException(
                    "Failed to store file");
        }
    }

    public Resource loadFile(String fileUrl) {

        try {

            String fileName =
                    fileUrl.substring(
                            fileUrl.lastIndexOf("/") + 1);

            Path uploadPath =
                    Paths.get(uploadDir)
                            .toAbsolutePath()
                            .normalize();

            Path filePath =
                    uploadPath
                            .resolve(fileName)
                            .normalize();

            if (!filePath.startsWith(uploadPath)) {
                throw new FileStorageException(
                        "Invalid file path");
            }

            Resource resource =
                    new UrlResource(
                            filePath.toUri());

            if (!resource.exists()
                    || !resource.isReadable()) {

                throw new FileStorageException(
                        "File not found");
            }

            return resource;

        } catch (IOException e) {

            throw new FileStorageException(
                    "Failed to read file");
        }
    }

    public void deleteFile(String fileName) {

        try {

            Path filePath =
                    Paths.get(uploadDir)
                            .resolve(fileName);

            Files.delete(filePath);

        } catch (IOException e) {

            throw new FileStorageException(
                    "Failed to delete file");
        }
    }

    public void validateFile(MultipartFile file) {

        if (file == null || file.isEmpty()) {

            throw new FileValidationException(
                    "File is required and cannot be empty");
        }

        if (file.getSize() > 5L * 1024 * 1024) {

            throw new FileValidationException(
                    "File size must not exceed 5 MB");
        }

        String fileName =
                file.getOriginalFilename();

        if (fileName == null
                || !fileName.contains(".")) {

            throw new FileValidationException(
                    "File must have a valid extension");
        }

        String extension =
                fileName
                        .substring(
                                fileName.lastIndexOf('.') + 1)
                        .toLowerCase();

        String contentType =
                file.getContentType();

        boolean valid =
                ("pdf".equals(extension)
                        && "application/pdf".equals(contentType))
                || ("jpg".equals(extension)
                        && "image/jpeg".equals(contentType))
                || ("jpeg".equals(extension)
                        && "image/jpeg".equals(contentType))
                || ("png".equals(extension)
                        && "image/png".equals(contentType))
                || ("txt".equals(extension)
                        && "text/plain".equals(contentType));

        if (!valid) {

            throw new FileValidationException(
                    "Only PDF, JPG, JPEG, PNG and TXT files are allowed");
        }
    }
}