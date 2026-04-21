package com.app.ecometa.dto;

import java.util.List;

public class NearbyRecyclerResponse {
    private String id;
    private String userId;
    private String name;
    private String address;
    private double distanceKm;
    private List<String> acceptedDeviceTypes;
    private double rating;
    private int reviewCount;
    private boolean openNow;
    private String closingTime;
    private double latitude;
    private double longitude;

    public NearbyRecyclerResponse() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(double distanceKm) { this.distanceKm = distanceKm; }

    public List<String> getAcceptedDeviceTypes() { return acceptedDeviceTypes; }
    public void setAcceptedDeviceTypes(List<String> acceptedDeviceTypes) { this.acceptedDeviceTypes = acceptedDeviceTypes; }

    public double getRating() { return rating; }
    public void setRating(double rating) { this.rating = rating; }

    public int getReviewCount() { return reviewCount; }
    public void setReviewCount(int reviewCount) { this.reviewCount = reviewCount; }

    public boolean isOpenNow() { return openNow; }
    public void setOpenNow(boolean openNow) { this.openNow = openNow; }

    public String getClosingTime() { return closingTime; }
    public void setClosingTime(String closingTime) { this.closingTime = closingTime; }

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }
}
