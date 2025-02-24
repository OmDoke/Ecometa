package com.app.ecometa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.app.ecometa.entity.Recycler;
import com.app.ecometa.repository.RecyclerRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/recyclers")
public class RecyclerController {
    
    @Autowired
    private RecyclerRepository recyclerRepository;

    // ✅ Get Recycler by User ID
    @GetMapping("/{userId}")
public ResponseEntity<?> getRecycler(@PathVariable Long userId) {
    Recycler recycler = recyclerRepository.findByUserId(userId); // Fetch Recycler
    
    if (recycler != null) {
        return ResponseEntity.ok(recycler); // Return Recycler if found
    } else {
        return ResponseEntity.status(404).body("Recycler not found"); // Handle not found case
    }
}


    // ✅ Add a new Recycler
    @PostMapping("/add")
    public ResponseEntity<?> addRecycler(@RequestBody Recycler recycler) {
        try {
            Recycler savedRecycler = recyclerRepository.save(recycler);
            return ResponseEntity.ok(savedRecycler);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error adding recycler: " + e.getMessage());
        }
    }

    // ✅ Update Recycler Details
    @PutMapping("/update/{userId}")
    public ResponseEntity<?> updateRecycler(@PathVariable Long userId, @RequestBody Recycler updatedRecycler) {
        Optional<Recycler> existingRecycler = Optional.ofNullable(recyclerRepository.findByUserId(userId));

        if (existingRecycler.isPresent()) {
            Recycler recycler = existingRecycler.get();
            recycler.setShopName(updatedRecycler.getShopName());
            recycler.setGstId(updatedRecycler.getGstId());
            recycler.setRegion(updatedRecycler.getRegion());
            recycler.setCollectionRegions(updatedRecycler.getCollectionRegions());

            recyclerRepository.save(recycler);
            return ResponseEntity.ok(recycler);
        } else {
            return ResponseEntity.status(404).body("Recycler not found");
        }
    }

    // ✅ Delete Recycler by User ID
    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<?> deleteRecycler(@PathVariable Long userId) {
        Optional<Recycler> recycler = Optional.ofNullable(recyclerRepository.findByUserId(userId));

        if (recycler.isPresent()) {
            recyclerRepository.delete(recycler.get());
            return ResponseEntity.ok("Recycler deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Recycler not found");
        }
    }

    // ✅ Get All Recyclers
    @GetMapping("/all")
    public ResponseEntity<List<Recycler>> getAllRecyclers() {
        List<Recycler> recyclers = recyclerRepository.findAll();
        return ResponseEntity.ok(recyclers);
    }
}
