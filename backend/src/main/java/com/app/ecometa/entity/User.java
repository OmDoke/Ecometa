package com.app.ecometa.entity;

import com.app.ecometa.enums.Enums.Role;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password; // BCrypt hashed

    private String phone;
    private String address;

    private String certificateUrl;
    private boolean isCertified;
    private int recycledCount;
    private int ecoPoints;

    @CreatedDate
    private Date createdAt;

    private Role role;

    public User() {}

    // ── Getters & Setters ────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }

    public boolean isCertified() { return isCertified; }
    public void setCertified(boolean isCertified) { this.isCertified = isCertified; }

    public int getRecycledCount() { return recycledCount; }
    public void setRecycledCount(int recycledCount) { this.recycledCount = recycledCount; }

    public int getEcoPoints() { return ecoPoints; }
    public void setEcoPoints(int ecoPoints) { this.ecoPoints = ecoPoints; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
