package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Vet;
import com.petshopmanagementsystem.Pet.shop.management.system.service.vetService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/app")
public class vetController {

    @Autowired
    private vetService vetService;

    @GetMapping("/getVets")
    public List<Vet> getVets(){
        return vetService.getAllVets();
    }

    @GetMapping("/getVet/{id}")
    public Vet getVetById(@PathVariable int id){
        return vetService.getVetById(id);
    }

    @PostMapping("/addVet")
    public Vet addVet(@RequestBody Vet vet){
        return vetService.addVet(vet);
    }

    @PutMapping("/updateVet")
    public Vet updateVet(@RequestBody Vet vet){
        return vetService.updateVet(vet);
    }

}
