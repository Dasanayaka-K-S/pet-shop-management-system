package com.petshopmanagementsystem.Pet.shop.management.system.DTO;

import java.time.LocalDateTime;

public class AppointmentDTO {

    private Integer appointmentId;
    private LocalDateTime appointmentDate;
    private String reason;
    private String status;
    private Integer petId;
    private String petName;
    private Integer vetId;
    private String vetName;

    // Constructors
    public AppointmentDTO() {
    }

    public AppointmentDTO(Integer appointmentId, LocalDateTime appointmentDate, String reason,
                          String status, Integer petId, String petName, Integer vetId, String vetName) {
        this.appointmentId = appointmentId;
        this.appointmentDate = appointmentDate;
        this.reason = reason;
        this.status = status;
        this.petId = petId;
        this.petName = petName;
        this.vetId = vetId;
        this.vetName = vetName;
    }

    // Getters and Setters
    public Integer getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Integer appointmentId) {
        this.appointmentId = appointmentId;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDateTime appointmentDate) {
        this.appointmentDate = appointmentDate;
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

    public Integer getPetId() {
        return petId;
    }

    public void setPetId(Integer petId) {
        this.petId = petId;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public Integer getVetId() {
        return vetId;
    }

    public void setVetId(Integer vetId) {
        this.vetId = vetId;
    }

    public String getVetName() {
        return vetName;
    }

    public void setVetName(String vetName) {
        this.vetName = vetName;
    }
}