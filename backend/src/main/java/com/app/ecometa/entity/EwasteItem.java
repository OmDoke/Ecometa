package com.app.ecometa.entity;

import com.app.ecometa.enums.Enums.Condition;
import com.app.ecometa.enums.Enums.EwasteType;
import com.app.ecometa.enums.Enums.Status;
import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonProperty;



@Entity
public class EwasteItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @JsonProperty("type")  // Ensure JSON property maps correctly
    private EwasteType type;

    @Enumerated(EnumType.STRING)
    @JsonProperty("condition") // Ensure JSON matches "condition" field
    private Condition item_condition;

    @JsonProperty("quantity")
    private int quantity;

    @Enumerated(EnumType.STRING)
    @JsonProperty("status")
    private Status status;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonProperty("user")  // Ensure JSON maps correctly
    private User user;

    @ManyToOne
    @JoinColumn(name = "recycler_id")
    @JsonProperty("recycler")  // Ensure JSON maps recycler correctly
    private User recycler;

    // Constructors
    public EwasteItem() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public EwasteType getType() {
        return type;
    }

    public void setType(EwasteType type) {
        this.type = type;
    }

    public Condition getItem_condition() {
        return item_condition;
    }

    public void setItem_condition(Condition item_condition) {
        this.item_condition = item_condition;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public User getRecycler() {
        return recycler;
    }

    public void setRecycler(User recycler) {
        this.recycler = recycler;
    }
}
