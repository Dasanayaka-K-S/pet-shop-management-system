package com.petshopmanagementsystem.Pet.shop.management.system.repo;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Vet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface vetRepo extends JpaRepository<Vet,Integer> {
}
