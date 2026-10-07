package com.datastraw.crm.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.datastraw.crm.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Long>{

	Optional<Customer> findByUser_Email(String email);
	
}
