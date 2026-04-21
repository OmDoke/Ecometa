package com.app.ecometa.repository;

import com.app.ecometa.entity.Recycler;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RecyclerRepository extends MongoRepository<Recycler, String> {
    Recycler findByUser_Id(String userId);
}
