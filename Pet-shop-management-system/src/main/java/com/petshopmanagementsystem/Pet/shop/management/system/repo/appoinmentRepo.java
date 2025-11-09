package com.petshopmanagementsystem.Pet.shop.management.system.repo;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appoinment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface appoinmentRepo extends JpaRepository<Appoinment,Integer> {
}
