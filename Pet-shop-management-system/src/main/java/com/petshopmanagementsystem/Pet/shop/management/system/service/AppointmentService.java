package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Pet;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Vet;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.AppointmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepo appointmentRepo;

    @Autowired
    private petService petService;

    @Autowired
    private vetService vetService;

    public Appointment saveAppointment(Appointment appointment) {
        // Set pet and vet entities based on IDs
        if (appointment.getPet() == null && appointment.getPetIdForJson() != null) {
            Pet pet = petService.findPetById(appointment.getPetIdForJson());
            appointment.setPet(pet);
        }

        if (appointment.getVet() == null && appointment.getVetIdForJson() != null) {
            Vet vet = vetService.getVetById(appointment.getVetIdForJson());
            appointment.setVet(vet);
        }

        Appointment saved = appointmentRepo.save(appointment);
        enrichAppointment(saved);
        return saved;
    }

    public Appointment findAppointmentById(int id) {
        Appointment appointment = appointmentRepo.findById(id).orElse(null);
        if (appointment != null) {
            enrichAppointment(appointment);
        }
        return appointment;
    }

    public List<Appointment> findAllAppointments() {
        List<Appointment> appointments = appointmentRepo.findAll();
        return appointments.stream()
                .map(this::enrichAppointment)
                .collect(Collectors.toList());
    }

    public Appointment updateAppointment(Appointment appointment) {
        // Set pet and vet entities based on IDs
        if (appointment.getPetIdForJson() != null) {
            Pet pet = petService.findPetById(appointment.getPetIdForJson());
            appointment.setPet(pet);
        }

        if (appointment.getVetIdForJson() != null) {
            Vet vet = vetService.getVetById(appointment.getVetIdForJson());
            appointment.setVet(vet);
        }

        Appointment updated = appointmentRepo.save(appointment);
        enrichAppointment(updated);
        return updated;
    }

    public void deleteAppointment(int id) {
        appointmentRepo.deleteById(id);
    }

    // Helper method to enrich appointment with pet and vet names
    private Appointment enrichAppointment(Appointment appointment) {
        if (appointment.getPet() != null) {
            appointment.setPetName(appointment.getPet().getPet_name());
            appointment.setPetIdForJson(appointment.getPet().getPet_id());
        }
        if (appointment.getVet() != null) {
            appointment.setVetName(appointment.getVet().getVet_name());
            appointment.setVetIdForJson(appointment.getVet().getVet_id());
        }
        return appointment;
    }
}