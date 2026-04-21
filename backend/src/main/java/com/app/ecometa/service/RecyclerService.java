package com.app.ecometa.service;

import com.app.ecometa.entity.Recycler;
import com.app.ecometa.entity.User;
import com.app.ecometa.exception.ResourceNotFoundException;
import com.app.ecometa.repository.RecyclerRepository;
import com.app.ecometa.repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RecyclerService {

    @Autowired
    private RecyclerRepository recyclerRepository;

    @Autowired
    private UserRepo userRepository;

    public Recycler getRecyclerByUserId(String userId) {
        Recycler recycler = recyclerRepository.findByUser_Id(userId);
        if (recycler == null) {
            throw new ResourceNotFoundException("Recycler profile not found for user ID: " + userId);
        }
        return recycler;
    }

    public Recycler updateOrCreateRecycler(String userId, Recycler updatedData) {
        Recycler recycler = recyclerRepository.findByUser_Id(userId);
        
        if (recycler == null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User account not found for ID: " + userId));
            recycler = new Recycler();
            recycler.setUser(user);
        }

        // Standardize fields
        recycler.setShopName(updatedData.getShopName() != null ? updatedData.getShopName() : updatedData.getName());
        recycler.setName(updatedData.getName());
        recycler.setGstId(updatedData.getGstId());
        recycler.setRegion(updatedData.getRegion());
        recycler.setCollectionRegions(updatedData.getCollectionRegions());
        recycler.setEmail(updatedData.getEmail());
        recycler.setPhone(updatedData.getPhone());
        recycler.setAddress(updatedData.getAddress());
        recycler.setLocation(updatedData.getLocation());
        recycler.setAcceptedDeviceTypes(updatedData.getAcceptedDeviceTypes());
        recycler.setOperatingHours(updatedData.getOperatingHours());

        return recyclerRepository.save(recycler);
    }

    public List<Recycler> getAllRecyclers() {
        return recyclerRepository.findAll();
    }

    public void deleteRecyclerByUserId(String userId) {
        Recycler recycler = recyclerRepository.findByUser_Id(userId);
        if (recycler == null) {
            throw new ResourceNotFoundException("Recycler profile not found for user ID: " + userId);
        }
        recyclerRepository.delete(recycler);
    }
}
