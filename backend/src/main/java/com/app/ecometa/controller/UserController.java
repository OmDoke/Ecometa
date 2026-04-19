package com.app.ecometa.controller;

import com.app.ecometa.entity.User;
import com.app.ecometa.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepo userRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // ── Register ─────────────────────────────────────────────────────────────

    @PostMapping("/register")
    public Map<String, Object> registerUser(@RequestBody User user) {
        Map<String, Object> response = new HashMap<>();

        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            response.put("error", "Email already registered!");
            return response;
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User saved = userRepository.save(user);

        response.put("message", "Registration successful");
        response.put("userId", saved.getId());
        response.put("role", saved.getRole());
        return response;
    }

    // ── Get User by ID ────────────────────────────────────────────────────────

    @GetMapping("/{id}")
    public User getUser(@PathVariable String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ── Login ─────────────────────────────────────────────────────────────────

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody User loginRequest) {
        Optional<User> user = userRepository.findByEmail(loginRequest.getEmail());

        Map<String, Object> response = new HashMap<>();

        if (user.isEmpty()) {
            response.put("error", "User not found");
            return response;
        }

        // BCrypt password check
        if (!passwordEncoder.matches(loginRequest.getPassword(), user.get().getPassword())) {
            response.put("error", "Invalid email or password");
            return response;
        }

        response.put("message", "Login successful");
        response.put("role", user.get().getRole().name());
        response.put("userId", user.get().getId());
        // token = userId for now (simple session). Can be upgraded to JWT later.
        response.put("token", user.get().getId());

        return response;
    }
}
