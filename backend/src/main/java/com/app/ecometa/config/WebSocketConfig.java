package com.app.ecometa.config;

import com.app.ecometa.entity.User;
import com.app.ecometa.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserRepo userRepo;

    @org.springframework.beans.factory.annotation.Value("${frontend.url:http://localhost:3000}")
    private String frontendUrl;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic", "/queue");
        config.setApplicationDestinationPrefixes("/app");
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:3000", frontendUrl)
                .withSockJS();
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    List<String> nativeHeaders = accessor.getNativeHeader("Authorization");
                    String token = (nativeHeaders != null && !nativeHeaders.isEmpty()) ? nativeHeaders.get(0) : null;

                    if (token != null && token.startsWith("Bearer ")) {
                        token = token.substring(7);
                        if (jwtUtils.validateToken(token)) {
                            String userId = jwtUtils.extractUserId(token);
                            Optional<User> userOpt = userRepo.findById(userId);

                            if (userOpt.isPresent()) {
                                User user = userOpt.get();
                                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                        user, null, Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
                                );
                                accessor.setUser(auth);
                            }
                        }
                    }
                }
                return message;
            }
        });
    }
}
