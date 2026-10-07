package com.datastraw.crm.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable = false, unique = true,length = 50)
	private String username;
	
	@Column(nullable = false, unique = true,length = 100)
	private String email;
	
	@Column(nullable = false,length = 255)
	private String password;
	
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "role_id",nullable = false)
	private Role role;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "manager_id")
	private User manager;
	
	@Column(nullable = false)
	private boolean enable;
	
	@Column(nullable = false)
	private LocalDateTime createdAt;
	
	@Column(nullable = false)
	private LocalDateTime updatedAt;
	
	@PrePersist
	protected void onCreate() {
		LocalDateTime now=LocalDateTime.now();
		createdAt=now;
		updatedAt=now;
	}
	
	@PreUpdate
	protected void onUpdated() {
		updatedAt=LocalDateTime.now();
	}
	
}
