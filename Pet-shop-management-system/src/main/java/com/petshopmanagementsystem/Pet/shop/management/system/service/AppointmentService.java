package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.appointmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class appoinmentService {

    @Autowired
    private appointmentRepo appointmentRepo;

    public Appointment addAppoinment(Appointment appointment) {
       return appointmentRepo.save(appointment);
    }

}
