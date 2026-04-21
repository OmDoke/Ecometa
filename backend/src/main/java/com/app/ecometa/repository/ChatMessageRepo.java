package com.app.ecometa.repository;

import com.app.ecometa.entity.ChatMessage;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepo extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByEwasteItemIdOrderByTimestampAsc(String ewasteItemId);
}
