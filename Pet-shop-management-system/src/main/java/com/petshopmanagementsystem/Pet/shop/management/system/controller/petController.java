package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Pet;
import com.petshopmanagementsystem.Pet.shop.management.system.service.petService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/app")
public class petController {

    @Autowired
    private petService petService;

    @PostMapping("/addPet")
    public Pet addPet(@RequestBody Pet pet) {  // ✅ Added @RequestBody
        return petService.savePet(pet);
    }

    @GetMapping("/getPets")
    public List<Pet> getAllPets() {
        return petService.findAllPets();
    }

    @GetMapping("/getPet/{id}")
    public Pet getPetById(@PathVariable int id) {
        return petService.findPetById(id);
    }

    @PutMapping("/updatePet")
    public Pet updatePet(@RequestBody Pet pet) {
        return petService.updatePet(pet);
    }
}