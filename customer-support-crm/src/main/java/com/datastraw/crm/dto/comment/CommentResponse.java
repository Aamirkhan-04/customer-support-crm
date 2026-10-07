package com.datastraw.crm.dto.comment;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CommentResponse {

	    private Long id;
	    private String comment;
	    private String userName;
	    private String userRole;
	    private LocalDateTime createdAt;
}
