package com.app.ecometa.controller;

import com.app.ecometa.entity.User;
import com.app.ecometa.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepo userRepository;

    // User Registration
    @PostMapping("/register")
    public User registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered!");
        }
        return userRepository.save(user);
    }

    // Get user by ID
    @GetMapping("/{id}")
    public User getUser(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // User Login without JWT
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        Map<String, Object> response = new HashMap<>();

        if (user.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }

        if (!user.get().getPassword().equals(loginRequest.getPassword())) {
            response.put("error", "Invalid email or password");
            return response;
        }

        // ✅ Include userId in the response
        response.put("message", "Login successful");
        response.put("role", user.get().getRole().name());
        response.put("userId", user.get().getId()); // Ensure userId is included

        return response;
    }

}
