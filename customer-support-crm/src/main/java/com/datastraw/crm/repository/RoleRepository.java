package com.datastraw.crm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.datastraw.crm.entity.Role;
import com.datastraw.crm.enums.RoleName;

public interface RoleRepository extends JpaRepository<Role, Long>{

	Optional<Role> findByName(RoleName  name);
}
