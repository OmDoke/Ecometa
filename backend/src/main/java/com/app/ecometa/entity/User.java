package com.app.ecometa.entity;

import com.app.ecometa.enums.Enums.Role;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String name;

    @Indexed(unique = true)
    private String email;

    private String password; // BCrypt hashed

    private String certificateUrl;
    private boolean isCertified;
    private int recycledAmount;

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

    public String getCertificateUrl() { return certificateUrl; }
    public void setCertificateUrl(String certificateUrl) { this.certificateUrl = certificateUrl; }

    public boolean isCertified() { return isCertified; }
    public void setCertified(boolean isCertified) { this.isCertified = isCertified; }

    public int getRecycledAmount() { return recycledAmount; }
    public void setRecycledAmount(int recycledAmount) { this.recycledAmount = recycledAmount; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
}
