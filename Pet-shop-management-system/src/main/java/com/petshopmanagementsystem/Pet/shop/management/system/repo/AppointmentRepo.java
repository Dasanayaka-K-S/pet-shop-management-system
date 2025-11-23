package com.petshopmanagementsystem.Pet.shop.management.system.repo;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepo extends JpaRepository<Appointment, Integer> {

    // ✅ Find all active (not completed/cancelled) appointments for a vet
    @Query("SELECT a FROM Appointment a WHERE a.vet.vet_id = :vetId " +
            "AND a.status IN ('Scheduled', 'In Progress') " +
            "ORDER BY a.appointment_date ASC")
    List<Appointment> findActiveAppointmentsByVetId(@Param("vetId") int vetId);

    // ✅ Find overlapping appointments for a vet in a time range
    @Query("SELECT a FROM Appointment a WHERE a.vet.vet_id = :vetId " +
            "AND a.status IN ('Scheduled', 'In Progress') " +
            "AND ((a.appointment_date <= :endTime AND a.appointment_end_time >= :startTime))")
    List<Appointment> findOverlappingAppointments(
            @Param("vetId") int vetId,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );

    // ✅ Find appointments by status
    @Query("SELECT a FROM Appointment a WHERE a.status = :status ORDER BY a.appointment_date DESC")
    List<Appointment> findByStatus(@Param("status") String status);

    // ✅ Find upcoming appointments (scheduled for future)
    @Query("SELECT a FROM Appointment a WHERE a.appointment_date >= :now " +
            "AND a.status = 'Scheduled' ORDER BY a.appointment_date ASC")
    List<Appointment> findUpcomingAppointments(@Param("now") LocalDateTime now);

    // ✅ Find appointments for a specific pet
    @Query("SELECT a FROM Appointment a WHERE a.pet.pet_id = :petId ORDER BY a.appointment_date DESC")
    List<Appointment> findByPetId(@Param("petId") int petId);

    // ✅ Count active appointments for a vet
    @Query("SELECT COUNT(a) FROM Appointment a WHERE a.vet.vet_id = :vetId " +
            "AND a.status IN ('Scheduled', 'In Progress')")
    long countActiveAppointmentsByVetId(@Param("vetId") int vetId);
}