package com.app.ecometa.entity;

import com.app.ecometa.enums.Enums.Condition;
import com.app.ecometa.enums.Enums.EwasteType;
import com.app.ecometa.enums.Enums.Status;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.Date;

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

    @JsonProperty("pickupAddress")
    private String pickupAddress;

    @JsonProperty("description")
    private String description;

    @DBRef
    @JsonProperty("user")
    private User user;

    @DBRef
    @JsonProperty("recycler")
    private User recycler;

    @CreatedDate
    private Date createdAt;

    @LastModifiedDate
    private Date updatedAt;

    private Date collectedAt;

    private Date scheduledPickupTime;

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

    public String getPickupAddress() { return pickupAddress; }
    public void setPickupAddress(String pickupAddress) { this.pickupAddress = pickupAddress; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public User getRecycler() { return recycler; }
    public void setRecycler(User recycler) { this.recycler = recycler; }

    public Date getCreatedAt() { return createdAt; }
    public void setCreatedAt(Date createdAt) { this.createdAt = createdAt; }

    public Date getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Date updatedAt) { this.updatedAt = updatedAt; }

    public Date getCollectedAt() { return collectedAt; }
    public void setCollectedAt(Date collectedAt) { this.collectedAt = collectedAt; }

    public Date getScheduledPickupTime() { return scheduledPickupTime; }
    public void setScheduledPickupTime(Date scheduledPickupTime) { this.scheduledPickupTime = scheduledPickupTime; }
}
