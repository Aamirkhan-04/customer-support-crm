package com.datastraw.crm.dto.userdto;

import com.datastraw.crm.enums.RoleName;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class UserRoleRequest {

	@NotNull(message = "Role is required")
	private RoleName role;
}
