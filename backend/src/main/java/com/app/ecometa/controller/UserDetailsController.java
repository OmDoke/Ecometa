package com.app.ecometa.controller;

import com.app.ecometa.entity.UserDetails;
import com.app.ecometa.exception.ResourceNotFoundException;
import com.app.ecometa.repository.UserDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/user-details")
public class UserDetailsController {

    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @GetMapping("/{userId}")
    public ResponseEntity<UserDetails> getUserDetails(@PathVariable String userId) {
        UserDetails details = userDetailsRepository.findByUser_Id(userId);
        if (details == null) {
            throw new ResourceNotFoundException("User details not found for ID: " + userId);
        }
        return ResponseEntity.ok(details);
    }

    @PostMapping("/add")
    public ResponseEntity<UserDetails> addUserDetails(@RequestBody UserDetails userDetails) {
        UserDetails saved = userDetailsRepository.save(userDetails);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }
}
