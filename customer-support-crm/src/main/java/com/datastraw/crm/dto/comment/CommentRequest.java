package com.datastraw.crm.dto.comment;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class CommentRequest {

	 @NotBlank(message = "Comment is required")
	 @Size(max = 1000, message = "Comment must not exceed 1000 characters")
	 private String comment;
}
