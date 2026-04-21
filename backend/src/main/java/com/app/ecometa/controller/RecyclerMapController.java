package com.app.ecometa.controller;

import com.app.ecometa.dto.NearbyRecyclerResponse;
import com.app.ecometa.service.RecyclerMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/map")
public class RecyclerMapController {

    @Autowired
    private RecyclerMapService recyclerMapService;

    // GET /api/map/recyclers?lat=18.5074&lng=73.8567&radiusKm=10&deviceTypes=phones,laptops
    @GetMapping("/recyclers")
    public ResponseEntity<List<NearbyRecyclerResponse>> getNearbyRecyclers(
        @RequestParam double lat,
        @RequestParam double lng,
        @RequestParam(defaultValue = "10") double radiusKm,
        @RequestParam(required = false) List<String> deviceTypes
    ) {
        // Privacy: Round coordinates to 3 decimal places before processing
        // Protects exact user location while maintaining accuracy to ~100m
        double roundedLat = Math.round(lat * 1000.0) / 1000.0;
        double roundedLng = Math.round(lng * 1000.0) / 1000.0;

        List<NearbyRecyclerResponse> response = recyclerMapService.getNearbyRecyclers(
            roundedLat, roundedLng, radiusKm, deviceTypes
        );
        
        return ResponseEntity.ok(response);
    }
}
