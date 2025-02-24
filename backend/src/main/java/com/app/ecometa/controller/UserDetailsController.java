package com.app.ecometa.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.app.ecometa.entity.UserDetails;
import com.app.ecometa.repository.UserDetailsRepository;

import java.util.Optional;

@RestController
@RequestMapping("/api/user-details")
public class UserDetailsController {
    @Autowired
    private UserDetailsRepository userDetailsRepository;

    @GetMapping("/{userId}")
    public Optional<UserDetails> getUserDetails(@PathVariable Long userId) {
        return Optional.ofNullable(userDetailsRepository.findByUserId(userId));
    }

    @PostMapping("/add")
    public UserDetails addUserDetails(@RequestBody UserDetails userDetails) {
        return userDetailsRepository.save(userDetails);
    }
}

