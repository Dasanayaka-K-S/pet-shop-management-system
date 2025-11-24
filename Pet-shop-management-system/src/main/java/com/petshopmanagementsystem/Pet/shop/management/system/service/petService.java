package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Owner;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Pet;
// ✅ ADD THIS IMPORT
import com.petshopmanagementsystem.Pet.shop.management.system.repo.ownerRepo;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.petRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class petService {

    @Autowired
    private petRepo petRepo;

    @Autowired
    private ownerRepo ownerRepo;  // ✅ ADD THIS AUTOWIRING

    public Pet savePet(Pet pet) {
        try {
            System.out.println("🐾 Saving pet: " + pet.getPet_name());


            Long ownerId = pet.getOwnerIdForJson();
            if (ownerId != null) {
                System.out.println("🔍 Looking for owner with ID: " + ownerId);
                Owner owner = ownerRepo.findById(ownerId).orElse(null);
                if (owner != null) {
                    pet.setOwner(owner);
                    System.out.println("✅ Owner found: " + owner.getOwner_name());
                } else {
                    System.err.println("❌ Owner not found with ID: " + ownerId);
                    throw new RuntimeException("Owner not found with id: " + ownerId);
                }
            }

            Pet savedPet = petRepo.save(pet);
            System.out.println("✅ Pet saved successfully with ID: " + savedPet.getPet_id());
            return savedPet;
        } catch (Exception e) {
            System.err.println("❌ Error saving pet: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public Pet findPetById(int id) {
        return petRepo.findById(id).orElse(null);
    }

    public List<Pet> findAllPets() {
        try {
            List<Pet> pets = petRepo.findAll();
            System.out.println("📦 Found " + pets.size() + " pets");
            return pets;
        } catch (Exception e) {
            System.err.println("❌ Error fetching pets: " + e.getMessage());
            throw e;
        }
    }

    public Pet updatePet(Pet pet) {
        try {
            System.out.println("✏️ Updating pet ID: " + pet.getPet_id());

            // Check if pet exists
            Pet existingPet = petRepo.findById(pet.getPet_id()).orElse(null);
            if (existingPet == null) {
                throw new RuntimeException("Pet not found with id: " + pet.getPet_id());
            }

            // Handle Long type for owner_id
            Long ownerId = pet.getOwnerIdForJson();
            if (ownerId != null) {
                System.out.println("🔍 Looking for owner with ID: " + ownerId);
                Owner owner = ownerRepo.findById(ownerId).orElse(null);
                if (owner != null) {
                    pet.setOwner(owner);
                    System.out.println("✅ Owner updated: " + owner.getOwner_name());
                } else {
                    throw new RuntimeException("Owner not found with id: " + ownerId);
                }
            } else {
                // Keep existing owner if no new owner_id provided
                pet.setOwner(existingPet.getOwner());
            }

            Pet updatedPet = petRepo.save(pet);
            System.out.println("✅ Pet updated successfully");
            return updatedPet;
        } catch (Exception e) {
            System.err.println("❌ Error updating pet: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public void deletePet(int id) {
        try {
            System.out.println("🗑️ Deleting pet ID: " + id);

            if (!petRepo.existsById(id)) {
                throw new RuntimeException("Pet not found with id: " + id);
            }

            petRepo.deleteById(id);
            System.out.println("✅ Pet deleted successfully");
        } catch (Exception e) {
            System.err.println("❌ Error deleting pet: " + e.getMessage());
            throw e;
        }
    }
}