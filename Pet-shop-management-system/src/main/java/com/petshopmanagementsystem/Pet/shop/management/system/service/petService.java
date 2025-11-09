package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Pet;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.petRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class petService {

    @Autowired
    private petRepo petRepo;

    public Pet savePet(Pet pet) {
        return petRepo.save(pet);
    }

    public Pet findPetById(int id) {
        return petRepo.findById(id).orElse(null);
    }

    public List<Pet> findAllPets() {
        return petRepo.findAll();
    }

    public Pet updatePet(Pet pet) {
        return petRepo.save(pet);
    }
    public void deletePet(int id) {
        petRepo.deleteById(id);
    }
}
