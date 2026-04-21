package com.app.ecometa.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;
import java.util.Map;

@Document(collection = "recyclers")
public class Recycler {

    @Id
    private String id;

    @DBRef
    private User user;

    private String shopName;
    private String gstId;
    private String region;
    private String collectionRegions;

    private String name;
    private String email;
    private String phone;
    private String address;

    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint location;

    private List<String> acceptedDeviceTypes;

    private Map<String, OperatingHours> operatingHours;

    private long totalCollected;
    private double rating;
    private int reviewCount;
    private boolean isActive = true;

    // ── Constructors ─────────────────────────────────────────────────────

    public Recycler() {}

    public Recycler(User user, String shopName, String gstId, String region, String collectionRegions) {
        this.user = user;
        this.shopName = shopName;
        this.gstId = gstId;
        this.region = region;
        this.collectionRegions = collectionRegions;
    }

    // ── Getters & Setters ────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getShopName() { return shopName; }
    public void setShopName(String shopName) { this.shopName = shopName; }

    public String getGstId() { return gstId; }
    public void setGstId(String gstId) { this.gstId = gstId; }

    public String getRegion() { return region; }
    public void setRegion(String region) { this.region = region; }

    public String getCollectionRegions() { return collectionRegions; }
    public void setCollectionRegions(String collectionRegions) { this.collectionRegions = collectionRegions; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public GeoJsonPoint getLocation() { return location; }
    public void setLocation(GeoJsonPoint location) { this.location = location; }

    public List<String> getAcceptedDeviceTypes() { return acceptedDeviceTypes; }
    public void setAcceptedDeviceTypes(List<String> acceptedDeviceTypes) { this.acceptedDeviceTypes = acceptedDeviceTypes; }

    public Map<String, OperatingHours> getOperatingHours() { return operatingHours; }
    public void setOperatingHours(Map<String, OperatingHours> operatingHours) { this.operatingHours = operatingHours; }

    public long getTotalCollected() { return totalCollected; }
    public void setTotalCollected(long totalCollected) { this.totalCollected = totalCollected; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    @Override
    public String toString() {
        return "Recycler{id=" + id + ", user=" + user + ", shopName='" + shopName + "', name='" + name + "'}";
    }

    public static class OperatingHours {
        private String open;
        private String close;

        public String getOpen() { return open; }
        public void setOpen(String open) { this.open = open; }

        public String getClose() { return close; }
        public void setClose(String close) { this.close = close; }
    }
}
