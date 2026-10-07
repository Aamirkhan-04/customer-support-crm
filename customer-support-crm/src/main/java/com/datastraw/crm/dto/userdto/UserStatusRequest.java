package com.datastraw.crm.dto.userdto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class UserStatusRequest {

	@NotNull(message = "Enabled status is required")
	private boolean enable;
}
