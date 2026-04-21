package com.app.ecometa.service;

import com.app.ecometa.entity.User;
import com.app.ecometa.exception.ConflictException;
import com.app.ecometa.exception.ResourceNotFoundException;
import com.app.ecometa.exception.UnauthorizedException;
import com.app.ecometa.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

import com.app.ecometa.config.JwtUtils;
import com.app.ecometa.dto.LoginResponse;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder(12);

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new ConflictException("Email already registered: " + user.getEmail());
        }

        // Hash the password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public LoginResponse login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }

        String token = jwtUtils.generateToken(user.getId(), user.getEmail(), user.getRole().name());
        
        return new LoginResponse(token, user.getRole().name(), user.getId());
    }

    public User getUserById(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with ID: " + id));
    }
    
    public User saveUser(User user) {
        return userRepository.save(user);
    }
}
