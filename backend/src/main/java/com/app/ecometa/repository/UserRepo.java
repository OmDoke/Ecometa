package com.app.ecometa.repository;

import com.app.ecometa.entity.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepo extends JpaRepository<User, Long> {
   Optional<User> findByEmail(String email);
}
