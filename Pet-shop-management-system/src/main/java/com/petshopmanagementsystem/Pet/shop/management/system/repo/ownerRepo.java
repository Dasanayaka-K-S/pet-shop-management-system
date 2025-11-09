package com.petshopmanagementsystem.Pet.shop.management.system.repo;

import com.petshopmanagementsystem.Pet.shop.management.system.PetShopManagementSystemApplication;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Owner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ownerRepo extends JpaRepository<Owner,Integer> {
}
