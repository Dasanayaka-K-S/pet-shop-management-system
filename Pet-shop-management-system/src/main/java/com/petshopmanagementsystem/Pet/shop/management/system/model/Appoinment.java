package com.petshopmanagementsystem.Pet.shop.management.system.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Appoinment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int appointment_id;

    private String appointment_date;
    private String reason;
    private  String status;

    @OneToOne
    @JoinColumn(name = "pet_id", referencedColumnName = "pet_id")
    @JsonBackReference
    private Pet pet;

//    @OneToMany
//    @JoinColumn(name = "vet_id" , referencedColumnName = "vet_id")
//    @JsonBackReference
//    private List<Vet> vets;

    public Appoinment(int appointment_id,  String appointment_date, String reason, String status, Pet pet, List<Vet> vets) {
        this.appointment_id = appointment_id;

        this.appointment_date = appointment_date;
        this.reason = reason;
        this.status = status;
        this.pet = pet;
//        this.vets = vets;
    }

    public Appoinment() {

    }

    public int getAppointment_id() {
        return appointment_id;
    }

    public void setAppointment_id(int appointment_id) {
        this.appointment_id = appointment_id;
    }


    public String getAppointment_date() {
        return appointment_date;
    }

    public void setAppointment_date(String appointment_date) {
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

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

//    public List<Vet> getVets() {
//        return vets;
//    }

//    public void setVets(List<Vet> vets) {
//        this.vets = vets;
//    }
}
