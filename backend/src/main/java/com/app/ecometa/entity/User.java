package com.app.ecometa.entity;

import com.app.ecometa.enums.Enums.Role;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class User {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	private String name;
	private String email;
	private String password;
	private String certificateUrl; // Store a link to the generated certificate
	private boolean isCertified; // True if certificate has been awarded
	private int recycledAmount; // 🔹 Track recycled e-waste amount

	@Enumerated(EnumType.STRING)
	private Role role;

	public User() {
	}

	// 🔹 Getter & Setter for recycledAmount
	public int getRecycledAmount() {
		return recycledAmount;
	}

	public void setRecycledAmount(int recycledAmount) {
		this.recycledAmount = recycledAmount;
	}


	public Long getId() {
		return this.id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return this.name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public Role getRole() {
		return this.role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public String getCertificateUrl() {
		return certificateUrl;
	}

	public void setCertificateUrl(String certificateUrl) {
		this.certificateUrl = certificateUrl;
	}

	public boolean isCertified() {
		return isCertified;
	}

	public void setCertified(boolean isCertified) {
		this.isCertified = isCertified;
	}
	
	
	

}






