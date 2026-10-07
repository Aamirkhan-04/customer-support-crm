package com.datastraw.crm.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import com.datastraw.crm.entity.Role;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.enums.RoleName;
import com.datastraw.crm.exception.RoleNotFoundException;
import com.datastraw.crm.repository.RoleRepository;
import com.datastraw.crm.repository.UserRepository;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

	private final RoleRepository roleRepository;
	private final UserRepository userRepository;
	private final PasswordEncoder passwordEncoder;
	
	@Value("${app.admin.username}")
	private String adminUsername;
	@Value("${app.admin.email}")
	private String adminEmail;
	@Value("${app.admin.password}")
	private String adminPassword;

	@Override
	public void run(String... args) throws Exception {
		
		for(RoleName roleName:RoleName.values()) {
			createRoleIfNotExists(roleName);
		}	
		  createAdminIfNotExists();
	}	
	public void createRoleIfNotExists(RoleName roleName) {
		
		if (roleRepository.findByName(roleName).isEmpty()) {
			Role role=new Role();
			role.setName(roleName);
			
			roleRepository.save(role);
		}
	}
	
	private void createAdminIfNotExists() {
		
		if (userRepository.findByEmail(adminEmail).isPresent()) {
			return;
		}
		Role adminRole = roleRepository.findByName(RoleName.ADMIN)
				        .orElseThrow(()->
				           new RoleNotFoundException(
				        		  "Role not found: " + RoleName.ADMIN));
		User admin =new User();
		
		admin.setUsername(adminUsername);
		admin.setEmail(adminEmail);
		admin.setPassword(passwordEncoder.encode(adminPassword));
		admin.setRole(adminRole);
		admin.setEnable(true);
		
		userRepository.save(admin);
	}
}
