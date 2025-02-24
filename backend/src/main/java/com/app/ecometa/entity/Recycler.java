package com.app.ecometa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "recyclers")
public class Recycler {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user; // Recycler is linked to a user

    private String shopName;
    private String gstId;
    private String region;
    private String collectionRegions;

    // ✅ Constructors
    public Recycler() {
    }

    public Recycler(User user, String shopName, String gstId, String region, String collectionRegions) {
        this.user = user;
        this.shopName = shopName;
        this.gstId = gstId;
        this.region = region;
        this.collectionRegions = collectionRegions;
    }

    // ✅ Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getShopName() {
        return shopName;
    }

    public void setShopName(String shopName) {
        this.shopName = shopName;
    }

    public String getGstId() {
        return gstId;
    }

    public void setGstId(String gstId) {
        this.gstId = gstId;
    }

    public String getRegion() {
        return region;
    }

    public void setRegion(String region) {
        this.region = region;
    }

    public String getCollectionRegions() {
        return collectionRegions;
    }

    public void setCollectionRegions(String collectionRegions) {
        this.collectionRegions = collectionRegions;
    }

    // ✅ ToString Method (For debugging)
    @Override
    public String toString() {
        return "Recycler{" +
                "id=" + id +
                ", user=" + user +
                ", shopName='" + shopName + '\'' +
                ", gstId='" + gstId + '\'' +
                ", region='" + region + '\'' +
                ", collectionRegions='" + collectionRegions + '\'' +
                '}';
    }
}
