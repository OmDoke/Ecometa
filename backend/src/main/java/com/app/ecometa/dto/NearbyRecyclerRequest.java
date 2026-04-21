package com.app.ecometa.dto;

import java.util.List;

public class NearbyRecyclerRequest {
    private double latitude;
    private double longitude;
    private double radiusKm = 10.0;
    private List<String> deviceTypes;

    public NearbyRecyclerRequest() {}

    public double getLatitude() { return latitude; }
    public void setLatitude(double latitude) { this.latitude = latitude; }

    public double getLongitude() { return longitude; }
    public void setLongitude(double longitude) { this.longitude = longitude; }

    public double getRadiusKm() { return radiusKm; }
    public void setRadiusKm(double radiusKm) { this.radiusKm = radiusKm; }

    public List<String> getDeviceTypes() { return deviceTypes; }
    public void setDeviceTypes(List<String> deviceTypes) { this.deviceTypes = deviceTypes; }
}
