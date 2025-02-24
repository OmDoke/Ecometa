package com.app.ecometa.repository;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.entity.User;
import com.app.ecometa.enums.Enums.Status;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EwasteItemRepo extends JpaRepository<EwasteItem, Long> {

   // Find by User (instead of using a raw userId)
   List<EwasteItem> findByUser(User user);  

   // Find by Recycler (instead of using a raw recyclerId)
   List<EwasteItem> findByRecycler(User recycler);
   
   List<EwasteItem> findByStatus(Status status);
   List<EwasteItem> findByUserAndStatus(User user, Status status);

}
