package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appoinment;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Vet;
import com.petshopmanagementsystem.Pet.shop.management.system.service.appoinmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/app")
public class appoinmentController {

    @Autowired
    private appoinmentService appoinmentService;

    @PostMapping("/addAppoinment")
    public Appoinment addAppoinment(@RequestBody Appoinment appoinment){
        return appoinmentService.addAppoinment(appoinment);
    }
}
