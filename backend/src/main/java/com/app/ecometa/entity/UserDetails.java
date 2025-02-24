package com.app.ecometa.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_details")
public class UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user; // Assuming there's a User entity

    private String phoneNumber;
    private String address;
    private String city;
    private String state;

    // Constructors, Getters, and Setters
}
