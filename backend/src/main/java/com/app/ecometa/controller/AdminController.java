package com.app.ecometa.controller;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.repository.EwasteItemRepo;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping({"/admin"})
public class AdminController {
   @Autowired
   private EwasteItemRepo ewasteRepository;

   public AdminController() {
   }

   @GetMapping({"/reports"})
   public List<EwasteItem> getRecyclingReports() {
      return this.ewasteRepository.findAll();
   }
}
