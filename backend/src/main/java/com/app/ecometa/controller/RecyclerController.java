package com.app.ecometa.controller;

import com.app.ecometa.entity.Recycler;
import com.app.ecometa.repository.RecyclerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recyclers")
public class RecyclerController {

    @Autowired
    private RecyclerRepository recyclerRepository;

    // ── Get Recycler by User ID ───────────────────────────────────────────────

    @GetMapping("/{userId}")
    public ResponseEntity<?> getRecycler(@PathVariable String userId) {
        Recycler recycler = recyclerRepository.findByUserId(userId);
        if (recycler != null) {
            return ResponseEntity.ok(recycler);
        }
        return ResponseEntity.status(404).body("Recycler not found");
    }

    // ── Add a new Recycler ────────────────────────────────────────────────────

    @PostMapping("/add")
    public ResponseEntity<?> addRecycler(@RequestBody Recycler recycler) {
        try {
            Recycler saved = recyclerRepository.save(recycler);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding recycler: " + e.getMessage());
        }
    }

    // ── Update Recycler Details ───────────────────────────────────────────────

    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateRecycler(@PathVariable String userId,
                                             @RequestBody Recycler updatedRecycler) {
        Optional<Recycler> existing = Optional.ofNullable(recyclerRepository.findByUserId(userId));
        if (existing.isPresent()) {
            Recycler recycler = existing.get();
            recycler.setShopName(updatedRecycler.getShopName());
            recycler.setGstId(updatedRecycler.getGstId());
            recycler.setRegion(updatedRecycler.getRegion());
            recycler.setCollectionRegions(updatedRecycler.getCollectionRegions());
            recyclerRepository.save(recycler);
            return ResponseEntity.ok(recycler);
        }
        return ResponseEntity.status(404).body("Recycler not found");
    }

    // ── Delete Recycler by User ID ────────────────────────────────────────────

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteRecycler(@PathVariable String userId) {
        Optional<Recycler> recycler = Optional.ofNullable(recyclerRepository.findByUserId(userId));
        if (recycler.isPresent()) {
            recyclerRepository.delete(recycler.get());
            return ResponseEntity.ok("Recycler deleted successfully");
        }
        return ResponseEntity.status(404).body("Recycler not found");
    }

    // ── Get All Recyclers ─────────────────────────────────────────────────────

    @GetMapping("/all")
    public ResponseEntity<List<Recycler>> getAllRecyclers() {
        return ResponseEntity.ok(recyclerRepository.findAll());
    }
}
