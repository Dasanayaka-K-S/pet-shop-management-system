package com.petshopmanagementsystem.Pet.shop.management.system.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "treatment_table")
public class Treatment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("treatment_id")
    private int treatment_id;

    @ManyToOne
    @JoinColumn(name = "appointment_id", referencedColumnName = "appointment_id")
    private Appointment appointment;

    @Column(length = 1000)
    private String diagnosis;

    @Column(length = 1000)
    private String prescription;

    @JsonProperty("treatment_date")
    private LocalDate treatment_date;

    @JsonProperty("follow_up_date")
    private LocalDate follow_up_date;

    // ✅ FIXED: Removed precision and scale for Double type
    private Double cost;

    @Column(length = 1000)
    private String notes;

    @Column(name = "created_at")
    private LocalDateTime created_at;

    @Column(name = "updated_at")
    private LocalDateTime updated_at;

    // Transient fields for frontend display
    @Transient
    @JsonProperty("petName")
    private String petName;

    @Transient
    @JsonProperty("vetName")
    private String vetName;

    @Transient
    @JsonProperty("ownerName")
    private String ownerName;

    @Transient
    @JsonProperty("appointment_id")
    @JsonAlias({"appointmentIdForJson", "appointmentId"})
    private Integer appointmentIdForJson;

    public Treatment() {
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
        this.treatment_date = LocalDate.now();
    }

    public Treatment(int treatment_id, Appointment appointment, String diagnosis,
                     String prescription, LocalDate treatment_date, Double cost) {
        this.treatment_id = treatment_id;
        this.appointment = appointment;
        this.diagnosis = diagnosis;
        this.prescription = prescription;
        this.treatment_date = treatment_date;
        this.cost = cost;
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
    }

    // Getters and Setters
    public int getTreatment_id() {
        return treatment_id;
    }

    public void setTreatment_id(int treatment_id) {
        this.treatment_id = treatment_id;
    }

    public Appointment getAppointment() {
        return appointment;
    }

    public void setAppointment(Appointment appointment) {
        this.appointment = appointment;
        if (appointment != null) {
            this.appointmentIdForJson = appointment.getAppointment_id();

            // Set pet and vet names from appointment
            if (appointment.getPet() != null) {
                this.petName = appointment.getPet().getPet_name();

                // Set owner name from pet
                if (appointment.getPet().getOwner() != null) {
                    this.ownerName = appointment.getPet().getOwner().getOwner_name();
                }
            }

            if (appointment.getVet() != null) {
                this.vetName = appointment.getVet().getVet_name();
            }
        }
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getPrescription() {
        return prescription;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }

    public LocalDate getTreatment_date() {
        return treatment_date;
    }

    public void setTreatment_date(LocalDate treatment_date) {
        this.treatment_date = treatment_date;
    }

    public LocalDate getFollow_up_date() {
        return follow_up_date;
    }

    public void setFollow_up_date(LocalDate follow_up_date) {
        this.follow_up_date = follow_up_date;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
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

    public String getOwnerName() {
        return ownerName;
    }

    public void setOwnerName(String ownerName) {
        this.ownerName = ownerName;
    }

    public Integer getAppointmentIdForJson() {
        return appointmentIdForJson;
    }

    public void setAppointmentIdForJson(Integer appointmentIdForJson) {
        this.appointmentIdForJson = appointmentIdForJson;
    }

    @Override
    public String toString() {
        return "Treatment{" +
                "treatment_id=" + treatment_id +
                ", appointment=" + (appointment != null ? appointment.getAppointment_id() : "null") +
                ", diagnosis='" + diagnosis + '\'' +
                ", prescription='" + prescription + '\'' +
                ", treatment_date=" + treatment_date +
                ", cost=" + cost +
                '}';
    }
}