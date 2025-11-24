package com.petshopmanagementsystem.Pet.shop.management.system.repo;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Treatment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface TreatmentRepo extends JpaRepository<Treatment, Integer> {

    // Find all treatments for a specific appointment
    @Query("SELECT t FROM Treatment t WHERE t.appointment.appointment_id = :appointmentId ORDER BY t.treatment_date DESC")
    List<Treatment> findByAppointmentId(@Param("appointmentId") int appointmentId);

    // Find all treatments for a specific pet
    @Query("SELECT t FROM Treatment t WHERE t.appointment.pet.pet_id = :petId ORDER BY t.treatment_date DESC")
    List<Treatment> findByPetId(@Param("petId") int petId);

    // Find treatments by date range
    @Query("SELECT t FROM Treatment t WHERE t.treatment_date BETWEEN :startDate AND :endDate ORDER BY t.treatment_date DESC")
    List<Treatment> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    // Find treatments with upcoming follow-ups
    @Query("SELECT t FROM Treatment t WHERE t.follow_up_date >= :today ORDER BY t.follow_up_date ASC")
    List<Treatment> findUpcomingFollowUps(@Param("today") LocalDate today);

    // Find treatments by vet
    @Query("SELECT t FROM Treatment t WHERE t.appointment.vet.vet_id = :vetId ORDER BY t.treatment_date DESC")
    List<Treatment> findByVetId(@Param("vetId") int vetId);

    // Count treatments by pet
    @Query("SELECT COUNT(t) FROM Treatment t WHERE t.appointment.pet.pet_id = :petId")
    long countByPetId(@Param("petId") int petId);
}