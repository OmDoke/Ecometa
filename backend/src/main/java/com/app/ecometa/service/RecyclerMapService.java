package com.app.ecometa.service;

import com.app.ecometa.dto.NearbyRecyclerResponse;
import com.app.ecometa.entity.Recycler;
import com.app.ecometa.repository.RecyclerMapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecyclerMapService {

    @Autowired
    private RecyclerMapRepository repository;

    public List<NearbyRecyclerResponse> getNearbyRecyclers(
        double lat, double lng, double radiusKm, List<String> deviceTypes
    ) {
        // MongoDB uses [longitude, latitude]
        Point location = new Point(lng, lat);
        Distance distance = new Distance(radiusKm, Metrics.KILOMETERS);

        List<Recycler> recyclers = repository.findByLocationNearAndIsActiveTrue(location, distance);

        return recyclers.stream()
                .filter(r -> isMatchingDeviceTypes(r, deviceTypes))
                .map(r -> mapToResponse(r, lat, lng))
                .sorted((a, b) -> Double.compare(a.getDistanceKm(), b.getDistanceKm()))
                .collect(Collectors.toList());
    }

    private boolean isMatchingDeviceTypes(Recycler r, List<String> filterTypes) {
        if (filterTypes == null || filterTypes.isEmpty()) return true;
        if (r.getAcceptedDeviceTypes() == null) return false;
        
        // Case-insensitive check
        List<String> recyclerTypes = r.getAcceptedDeviceTypes().stream()
                .map(String::toLowerCase)
                .collect(Collectors.toList());
        
        return filterTypes.stream()
                .map(String::toLowerCase)
                .anyMatch(recyclerTypes::contains);
    }

    private NearbyRecyclerResponse mapToResponse(Recycler r, double userLat, double userLng) {
        NearbyRecyclerResponse res = new NearbyRecyclerResponse();
        res.setId(r.getId());
        if (r.getUser() != null) {
            res.setUserId(r.getUser().getId());
        }
        res.setName(r.getName() != null ? r.getName() : r.getShopName());
        res.setAddress(r.getAddress());
        res.setAcceptedDeviceTypes(r.getAcceptedDeviceTypes());
        res.setRating(r.getRating());
        res.setReviewCount(r.getReviewCount());
        
        if (r.getLocation() != null && r.getLocation().getCoordinates() != null) {
            List<Double> coords = r.getLocation().getCoordinates();
            res.setLongitude(coords.get(0));
            res.setLatitude(coords.get(1));
            res.setDistanceKm(calculateDistance(userLat, userLng, res.getLatitude(), res.getLongitude()));
        }

        // OpenNow logic (IST - Asia/Kolkata)
        ZoneId istZone = ZoneId.of("Asia/Kolkata");
        ZonedDateTime nowIST = ZonedDateTime.now(istZone);
        String dayOfWeek = nowIST.getDayOfWeek().name().toLowerCase();

        if (r.getOperatingHours() != null && r.getOperatingHours().get(dayOfWeek) != null) {
            Recycler.OperatingHours hours = r.getOperatingHours().get(dayOfWeek);
            try {
                LocalTime openTime = LocalTime.parse(hours.getOpen());
                LocalTime closeTime = LocalTime.parse(hours.getClose());
                LocalTime currentTime = nowIST.toLocalTime();

                boolean isOpen = currentTime.isAfter(openTime) && currentTime.isBefore(closeTime);
                res.setOpenNow(isOpen);
                res.setClosingTime(formatTime(closeTime));
            } catch (Exception e) {
                res.setOpenNow(false);
            }
        } else {
            res.setOpenNow(false);
        }

        return res;
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Earth radius in KM
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return Math.round(R * c * 100.0) / 100.0; // Two decimal places
    }

    private String formatTime(LocalTime time) {
        return time.format(DateTimeFormatter.ofPattern("h:mm a"));
    }
}
