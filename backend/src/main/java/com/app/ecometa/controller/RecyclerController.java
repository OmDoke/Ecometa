package com.app.ecometa.controller;

import com.app.ecometa.entity.Recycler;
import com.app.ecometa.service.RecyclerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recyclers")
public class RecyclerController {

    @Autowired
    private RecyclerService recyclerService;

    @GetMapping("/{userId}")
    public ResponseEntity<Recycler> getRecycler(@PathVariable String userId) {
        return ResponseEntity.ok(recyclerService.getRecyclerByUserId(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<Recycler> addRecycler(@RequestBody Recycler recycler) {
        // Shared addition/update logic in service
        Recycler saved = recyclerService.updateOrCreateRecycler(recycler.getUser().getId(), recycler);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Recycler> updateRecycler(@PathVariable String userId, @RequestBody Recycler updatedRecycler) {
        Recycler saved = recyclerService.updateOrCreateRecycler(userId, updatedRecycler);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/delete/{userId}")
    public ResponseEntity<String> deleteRecycler(@PathVariable String userId) {
        recyclerService.deleteRecyclerByUserId(userId);
        return ResponseEntity.ok("Recycler deleted successfully");
    }

    @GetMapping("/all")
    public ResponseEntity<List<Recycler>> getAllRecyclers() {
        return ResponseEntity.ok(recyclerService.getAllRecyclers());
    }
}
