package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import com.petshopmanagementsystem.Pet.shop.management.system.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/app")
public class appoinmentController {

    @Autowired
    private AppointmentService AppointmentService;

    @PostMapping("/addAppoinment")
    public Appointment addAppoinment(@RequestBody Appointment appointment){
        return AppointmentService.addAppoinment(appointment);
    }
}
