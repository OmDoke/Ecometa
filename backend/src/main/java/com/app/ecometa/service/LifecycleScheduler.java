package com.app.ecometa.service;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.enums.Enums.Status;
import com.app.ecometa.repository.EwasteItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.logging.Logger;

@Service
public class LifecycleScheduler {

    private static final Logger logger = Logger.getLogger(LifecycleScheduler.class.getName());

    @Autowired
    private EwasteItemRepo ewasteItemRepo;

    /**
     * Runs every hour to check for missed pickups.
     * Logic: If Item is ACCEPTED and current time > scheduledPickupTime + 24 hours.
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupMissedPickups() {
        logger.info("Running automated lifecycle cleanup for missed pickups...");
        
        List<EwasteItem> acceptedItems = ewasteItemRepo.findByStatus(Status.ACCEPTED);
        Date now = new Date();
        long twentyFourHoursInMillis = 24 * 60 * 60 * 1000;

        for (EwasteItem item : acceptedItems) {
            if (item.getScheduledPickupTime() != null) {
                long diff = now.getTime() - item.getScheduledPickupTime().getTime();
                if (diff > twentyFourHoursInMillis) {
                    logger.warning("Auto-transitioning Item ID " + item.getId() + " to FAILED_PICKUP due to 24h expiration.");
                    item.setStatus(Status.FAILED_PICKUP);
                    ewasteItemRepo.save(item);
                    // Potential: Notify user via Email here
                }
            }
        }
    }
}
