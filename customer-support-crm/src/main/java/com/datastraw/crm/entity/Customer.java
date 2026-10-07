package com.datastraw.crm.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name ="customers")
@Setter
@Getter
@NoArgsConstructor
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "user_id",nullable = false,unique = true)
	private User user;
	
	@Column(nullable = false,length = 100)
	private String name;
	
	@Column(nullable = false,unique = true,length = 100)
	private String email;
	
	@Column(length = 20)
	private String phone;
	
	@Column(length =255)
	private String address;
	
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
