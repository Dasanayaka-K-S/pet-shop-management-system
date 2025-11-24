package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Treatment;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.TreatmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TreatmentService {

    @Autowired
    private TreatmentRepo treatmentRepo;

    @Autowired
    private AppointmentService appointmentService;

    public Treatment saveTreatment(Treatment treatment) {
        System.out.println("=== New Treatment Record ===");

        // Set appointment entity
        setAppointmentEntity(treatment);

        // Validate required fields
        validateTreatment(treatment);

        // Set default values
        if (treatment.getTreatment_date() == null) {
            treatment.setTreatment_date(LocalDate.now());
        }

        Treatment saved = treatmentRepo.save(treatment);
        enrichTreatment(saved);

        System.out.println("✅ Treatment record created successfully: ID=" + saved.getTreatment_id());
        return saved;
    }

    public Treatment findTreatmentById(int id) {
        Treatment treatment = treatmentRepo.findById(id).orElse(null);
        if (treatment != null) {
            enrichTreatment(treatment);
        }
        return treatment;
    }

    public List<Treatment> findAllTreatments() {
        List<Treatment> treatments = treatmentRepo.findAll();
        return treatments.stream()
                .map(this::enrichTreatment)
                .collect(Collectors.toList());
    }

    public Treatment updateTreatment(Treatment treatment) {
        System.out.println("=== Update Treatment Record: ID=" + treatment.getTreatment_id() + " ===");

        // Check if treatment exists
        Treatment existing = treatmentRepo.findById(treatment.getTreatment_id()).orElse(null);
        if (existing == null) {
            throw new RuntimeException("Treatment record not found with ID: " + treatment.getTreatment_id());
        }

        // Set appointment entity
        setAppointmentEntity(treatment);

        // Validate
        validateTreatment(treatment);

        // Update timestamp
        treatment.setUpdated_at(java.time.LocalDateTime.now());

        Treatment updated = treatmentRepo.save(treatment);
        enrichTreatment(updated);

        System.out.println("✅ Treatment record updated successfully");
        return updated;
    }

    public void deleteTreatment(int id) {
        Treatment treatment = treatmentRepo.findById(id).orElse(null);
        if (treatment != null) {
            System.out.println("🗑️ Deleting treatment record: ID=" + id);
            treatmentRepo.deleteById(id);
        }
    }

    // Additional query methods
    public List<Treatment> findByAppointmentId(int appointmentId) {
        return treatmentRepo.findByAppointmentId(appointmentId).stream()
                .map(this::enrichTreatment)
                .collect(Collectors.toList());
    }

    public List<Treatment> findByPetId(int petId) {
        return treatmentRepo.findByPetId(petId).stream()
                .map(this::enrichTreatment)
                .collect(Collectors.toList());
    }

    public List<Treatment> findUpcomingFollowUps() {
        return treatmentRepo.findUpcomingFollowUps(LocalDate.now()).stream()
                .map(this::enrichTreatment)
                .collect(Collectors.toList());
    }

    // ============ PRIVATE HELPER METHODS ============

    private void setAppointmentEntity(Treatment treatment) {
        if (treatment.getAppointment() == null && treatment.getAppointmentIdForJson() != null) {
            Appointment appointment = appointmentService.findAppointmentById(treatment.getAppointmentIdForJson());
            if (appointment == null) {
                throw new RuntimeException("Appointment not found with ID: " + treatment.getAppointmentIdForJson());
            }
            treatment.setAppointment(appointment);
        }
    }

    private void validateTreatment(Treatment treatment) {
        if (treatment.getAppointment() == null) {
            throw new RuntimeException("Appointment is required for treatment record");
        }

        if (treatment.getDiagnosis() == null || treatment.getDiagnosis().trim().isEmpty()) {
            throw new RuntimeException("Diagnosis is required");
        }

        if (treatment.getCost() != null && treatment.getCost() < 0) {
            throw new RuntimeException("Cost cannot be negative");
        }
    }

    private Treatment enrichTreatment(Treatment treatment) {
        if (treatment.getAppointment() != null) {
            treatment.setAppointmentIdForJson(treatment.getAppointment().getAppointment_id());

            if (treatment.getAppointment().getPet() != null) {
                treatment.setPetName(treatment.getAppointment().getPet().getPet_name());

                if (treatment.getAppointment().getPet().getOwner() != null) {
                    treatment.setOwnerName(treatment.getAppointment().getPet().getOwner().getOwner_name());
                }
            }

            if (treatment.getAppointment().getVet() != null) {
                treatment.setVetName(treatment.getAppointment().getVet().getVet_name());
            }
        }

        return treatment;
    }
}