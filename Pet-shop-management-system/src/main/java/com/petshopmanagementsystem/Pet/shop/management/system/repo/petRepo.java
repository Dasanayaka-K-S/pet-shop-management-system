package com.petshopmanagementsystem.Pet.shop.management.system.repo;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Pet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface petRepo extends JpaRepository<Pet, Integer> {
}