package com.petshopmanagementsystem.Pet.shop.management.system.repo;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Integer> {


}
