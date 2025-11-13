package com.petshopmanagementsystem.Pet.shop.management.system.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointment_table")
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("appointment_id")
    private int appointment_id;

    @ManyToOne
    @JoinColumn(name = "pet_id", referencedColumnName = "pet_id")
    private Pet pet;

    @ManyToOne
    @JoinColumn(name = "vet_id", referencedColumnName = "vet_id")
    private Vet vet;

    @JsonProperty("appointment_date")
    private LocalDateTime appointment_date;

    private String reason;
    private String status; // Scheduled, Completed, Cancelled

    // Transient fields for frontend display
    @Transient
    @JsonProperty("petName")
    private String petName;

    @Transient
    @JsonProperty("vetName")
    private String vetName;

    @Transient
    @JsonProperty("pet_id")
    private Integer petIdForJson;

    @Transient
    @JsonProperty("vet_id")
    private Integer vetIdForJson;

    public Appointment() {
    }

    public Appointment(int appointment_id, Pet pet, Vet vet, LocalDateTime appointment_date,
                       String reason, String status) {
        this.appointment_id = appointment_id;
        this.pet = pet;
        this.vet = vet;
        this.appointment_date = appointment_date;
        this.reason = reason;
        this.status = status;
    }

    // Getters and Setters
    public int getAppointment_id() {
        return appointment_id;
    }

    public void setAppointment_id(int appointment_id) {
        this.appointment_id = appointment_id;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
        if (pet != null) {
            this.petName = pet.getPet_name();
            this.petIdForJson = pet.getPet_id();
        }
    }

    public Vet getVet() {
        return vet;
    }

    public void setVet(Vet vet) {
        this.vet = vet;
        if (vet != null) {
            this.vetName = vet.getVet_name();
            this.vetIdForJson = vet.getVet_id();
        }
    }

    public LocalDateTime getAppointment_date() {
        return appointment_date;
    }

    public void setAppointment_date(LocalDateTime appointment_date) {
        this.appointment_date = appointment_date;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public String getVetName() {
        return vetName;
    }

    public void setVetName(String vetName) {
        this.vetName = vetName;
    }

    public Integer getPetIdForJson() {
        return petIdForJson;
    }

    public void setPetIdForJson(Integer petIdForJson) {
        this.petIdForJson = petIdForJson;
    }

    public Integer getVetIdForJson() {
        return vetIdForJson;
    }

    public void setVetIdForJson(Integer vetIdForJson) {
        this.vetIdForJson = vetIdForJson;
    }

    @Override
    public String toString() {
        return "Appointment{" +
                "appointment_id=" + appointment_id +
                ", pet=" + (pet != null ? pet.getPet_id() : "null") +
                ", vet=" + (vet != null ? vet.getVet_id() : "null") +
                ", appointment_date=" + appointment_date +
                ", reason='" + reason + '\'' +
                ", status='" + status + '\'' +
                '}';
    }
}