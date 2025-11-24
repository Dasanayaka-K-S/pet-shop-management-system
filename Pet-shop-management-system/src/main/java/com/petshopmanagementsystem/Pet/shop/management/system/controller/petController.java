package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Pet;
import com.petshopmanagementsystem.Pet.shop.management.system.service.petService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/app")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})  // ✅ ADD THIS
public class petController {

    @Autowired
    private petService petService;

    @PostMapping("/addPet")
    public Pet addPet(@RequestBody Pet pet) {
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

    @DeleteMapping("/deletePet/{id}")
    public ResponseEntity<String> deletePet(@PathVariable int id) {
        try {
            Pet pet = petService.findPetById(id);
            if (pet == null) {
                return new ResponseEntity<>("Pet not found", HttpStatus.NOT_FOUND);
            }
            petService.deletePet(id);
            return new ResponseEntity<>("Pet deleted successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Failed to delete pet: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
