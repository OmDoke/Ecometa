package com.app.ecometa.entity;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "chat_messages")
public class ChatMessage {

    @Id
    private String id;

    @Indexed
    private String ewasteItemId;

    private String senderId;
    private String receiverId;
    private String content;

    private boolean readStatus;

    @CreatedDate
    private Date timestamp;

    public ChatMessage() {}

    public ChatMessage(String ewasteItemId, String senderId, String receiverId, String content) {
        this.ewasteItemId = ewasteItemId;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.readStatus = false;
        this.timestamp = new Date();
    }

    // ── Getters & Setters ────────────────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getEwasteItemId() { return ewasteItemId; }
    public void setEwasteItemId(String ewasteItemId) { this.ewasteItemId = ewasteItemId; }

    public String getSenderId() { return senderId; }
    public void setSenderId(String senderId) { this.senderId = senderId; }

    public String getReceiverId() { return receiverId; }
    public void setReceiverId(String receiverId) { this.receiverId = receiverId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public boolean isReadStatus() { return readStatus; }
    public void setReadStatus(boolean readStatus) { this.readStatus = readStatus; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
}
