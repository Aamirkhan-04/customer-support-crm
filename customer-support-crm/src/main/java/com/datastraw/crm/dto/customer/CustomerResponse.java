package com.datastraw.crm.dto.customer;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CustomerResponse {

	private Long id;
	private String name;
	private String email;
	private String phone;
	private String address;
}
