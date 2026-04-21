package com.app.ecometa.controller;

import com.app.ecometa.entity.ChatMessage;
import com.app.ecometa.entity.User;
import com.app.ecometa.exception.UnauthorizedException;
import com.app.ecometa.repository.ChatMessageRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ewaste/chat")
public class ChatController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private ChatMessageRepo chatMessageRepo;

    /**
     * STOMP: Real-time message receiver and broadcaster.
     * Destination: /app/chat.send
     */
    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessage chatMessage) {
        System.out.println("Chat: Received message for item " + chatMessage.getEwasteItemId());
        
        // Ensure server-side timestamp and reset ID to let Mongo generate one if missing
        chatMessage.setId(null); 
        if (chatMessage.getTimestamp() == null) {
            chatMessage.setTimestamp(new java.util.Date());
        }
        
        ChatMessage saved = chatMessageRepo.save(chatMessage);
        System.out.println("Chat: Saved message with ID " + saved.getId() + " for item " + saved.getEwasteItemId());
        
        // Broadcast to relevant item topic
        messagingTemplate.convertAndSend("/topic/ewaste/" + chatMessage.getEwasteItemId(), saved);
    }

    /**
     * REST: Fetch chat history for a specific e-waste item.
     */
    @GetMapping("/{ewasteItemId}")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@PathVariable String ewasteItemId) {
        System.out.println("Chat: Fetching history for item " + ewasteItemId);
        List<ChatMessage> history = chatMessageRepo.findByEwasteItemIdOrderByTimestampAsc(ewasteItemId);
        return ResponseEntity.ok(history);
    }
}
