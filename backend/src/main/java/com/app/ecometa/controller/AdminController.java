package com.app.ecometa.controller;

import com.app.ecometa.entity.EwasteItem;
import com.app.ecometa.repository.EwasteItemRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private EwasteItemRepo ewasteRepository;

    @GetMapping("/reports")
    public ResponseEntity<List<EwasteItem>> getRecyclingReports() {
        return ResponseEntity.ok(ewasteRepository.findAll());
    }
}
