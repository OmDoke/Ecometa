package com.app.ecometa.repository;

import com.app.ecometa.entity.UserDetails;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserDetailsRepository extends MongoRepository<UserDetails, String> {
    UserDetails findByUserId(String userId);
}
