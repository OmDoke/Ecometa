package com.app.ecometa.repository;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.entity.User;
import com.app.ecometa.enums.Enums.Status;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface EwasteItemRepo extends MongoRepository<EwasteItem, String> {

    List<EwasteItem> findByUser(User user);

    List<EwasteItem> findByRecycler(User recycler);

    List<EwasteItem> findByStatus(Status status);

    List<EwasteItem> findByUserAndStatus(User user, Status status);
}
