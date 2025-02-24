package com.app.ecometa.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.app.ecometa.entity.Recycler;

@Repository
public interface RecyclerRepository extends JpaRepository<Recycler, Long> {
    Recycler findByUserId(Long userId);
}

