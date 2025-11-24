package com.petshopmanagementsystem.Pet.shop.management.system.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonAlias;
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

    @JsonProperty("appointment_end_time")
    private LocalDateTime appointment_end_time;

    @Column(name = "duration_minutes")
    private Integer duration_minutes = 30;

    private String reason;

    @Column(length = 20)
    private String status;

    @Column(length = 500)
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

    // ✅ FIXED: Accept both "pet_id" and "petIdForJson"
    @Transient
    @JsonProperty("pet_id")
    @JsonAlias({"petIdForJson", "petId"})
    private Integer petIdForJson;

    // ✅ FIXED: Accept both "vet_id" and "vetIdForJson"
    @Transient
    @JsonProperty("vet_id")
    @JsonAlias({"vetIdForJson", "vetId"})
    private Integer vetIdForJson;

    public Appointment() {
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
        this.status = "Scheduled";
    }

    public Appointment(int appointment_id, Pet pet, Vet vet, LocalDateTime appointment_date,
                       String reason, String status) {
        this.appointment_id = appointment_id;
        this.pet = pet;
        this.vet = vet;
        this.appointment_date = appointment_date;
        this.reason = reason;
        this.status = status;
        this.created_at = LocalDateTime.now();
        this.updated_at = LocalDateTime.now();
    }

    // ✅ Calculate end time based on duration
    public void calculateEndTime() {
        if (this.appointment_date != null && this.duration_minutes != null) {
            this.appointment_end_time = this.appointment_date.plusMinutes(this.duration_minutes);
        }
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
        calculateEndTime();
    }

    public LocalDateTime getAppointment_end_time() {
        return appointment_end_time;
    }

    public void setAppointment_end_time(LocalDateTime appointment_end_time) {
        this.appointment_end_time = appointment_end_time;
    }

    public Integer getDuration_minutes() {
        return duration_minutes;
    }

    public void setDuration_minutes(Integer duration_minutes) {
        this.duration_minutes = duration_minutes;
        calculateEndTime();
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
        this.updated_at = LocalDateTime.now();
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
                ", status='" + status + '\'' +
                ", reason='" + reason + '\'' +
                '}';
    }
}