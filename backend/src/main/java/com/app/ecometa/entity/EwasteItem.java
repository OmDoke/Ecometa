package com.app.ecometa.entity;

import com.app.ecometa.enums.Enums.Condition;
import com.app.ecometa.enums.Enums.EwasteType;
import com.app.ecometa.enums.Enums.Status;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "ewaste_items")
public class EwasteItem {

    @Id
    private String id;

    @JsonProperty("type")
    private EwasteType type;

    @Field("item_condition")
    @JsonProperty("condition")
    private Condition item_condition;

    @JsonProperty("quantity")
    private int quantity;

    @JsonProperty("status")
    private Status status;

    @DBRef
    @JsonProperty("user")
    private User user;

    @DBRef
    @JsonProperty("recycler")
    private User recycler;

    public EwasteItem() {}

    // ── Getters & Setters ────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public EwasteType getType() { return type; }
    public void setType(EwasteType type) { this.type = type; }

    public Condition getItem_condition() { return item_condition; }
    public void setItem_condition(Condition item_condition) { this.item_condition = item_condition; }

    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public User getRecycler() { return recycler; }
    public void setRecycler(User recycler) { this.recycler = recycler; }
}
