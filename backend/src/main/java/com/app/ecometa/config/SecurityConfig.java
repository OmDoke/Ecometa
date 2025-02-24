package com.app.ecometa.config;

import java.util.List;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AuthorizeHttpRequestsConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class SecurityConfig {
   public SecurityConfig() {
   }

   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
      return (SecurityFilterChain)http.cors((cors) -> {
         cors.configurationSource(this.corsConfigurationSource());
      }).csrf((csrf) -> {
         csrf.disable();
      }).authorizeHttpRequests((auth) -> {
         ((AuthorizeHttpRequestsConfigurer.AuthorizedUrl)auth.anyRequest()).permitAll();
      }).sessionManagement((session) -> {
         session.sessionCreationPolicy(SessionCreationPolicy.STATELESS);
      }).build();
   }

   @Bean
   public CorsFilter corsFilter() {
      return new CorsFilter(this.corsConfigurationSource());
   }

   private UrlBasedCorsConfigurationSource corsConfigurationSource() {
      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      CorsConfiguration config = new CorsConfiguration();
      config.setAllowCredentials(true);
      config.setAllowedOrigins(List.of("http://localhost:3000"));
      config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      config.setAllowedHeaders(List.of("*"));
      source.registerCorsConfiguration("/**", config);
      return source;
   }
}
