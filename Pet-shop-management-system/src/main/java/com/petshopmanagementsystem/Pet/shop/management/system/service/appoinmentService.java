package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appoinment;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.appoinmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class appoinmentService {

    @Autowired
    private appoinmentRepo appoinmentRepo;

    public Appoinment addAppoinment(Appoinment appoinment) {
       return appoinmentRepo.save(appoinment);
    }

}
