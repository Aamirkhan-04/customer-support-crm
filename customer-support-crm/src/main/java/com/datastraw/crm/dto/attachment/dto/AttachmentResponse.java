package com.datastraw.crm.dto.attachment.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class AttachmentResponse {

	    private Long id;
	    private String fileName;
	    private String fileUrl;
	    private String contentType;
	    private Long fileSize;
	    private Long  uploadedBy;
	    private LocalDateTime createdAt;
}
