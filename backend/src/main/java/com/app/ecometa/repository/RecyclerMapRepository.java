package com.app.ecometa.repository;

import com.app.ecometa.entity.Recycler;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecyclerMapRepository extends MongoRepository<Recycler, String> {

    // Spring Data Mongo handles $geoNear via this method signature
    List<Recycler> findByLocationNearAndIsActiveTrue(
        Point location,
        Distance distance
    );
}
