package com.petshopmanagementsystem.Pet.shop.management.system.model;

import jakarta.persistence.*;

@Entity
@Table(name = "vet_table")
public class Vet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int vet_id ;
    private String vet_name;
    private String specialization;
    private String phone;
    private String email;
    private int experience_years ;
    private String availability ;

    public Vet(String availability, int experience_years, String email, String phone, String specialization, String vet_name, int vet_id) {
        this.availability = availability;
        this.experience_years = experience_years;
        this.email = email;
        this.phone = phone;
        this.specialization = specialization;
        this.vet_name = vet_name;
        this.vet_id = vet_id;
    }

    public Vet() {

    }

    public int getVet_id() {
        return vet_id;
    }

    public void setVet_id(int vet_id) {
        this.vet_id = vet_id;
    }

    public String getVet_name() {
        return vet_name;
    }

    public void setVet_name(String vet_name) {
        this.vet_name = vet_name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public int getExperience_years() {
        return experience_years;
    }

    public void setExperience_years(int experience_years) {
        this.experience_years = experience_years;
    }

    public String getAvailability() {
        return availability;
    }

    public void setAvailability(String availability) {
        this.availability = availability;
    }

    @Override
    public String toString() {
        return "Vet{" +
                "vet_id=" + vet_id +
                ", vet_name='" + vet_name + '\'' +
                ", specialization='" + specialization + '\'' +
                ", phone='" + phone + '\'' +
                ", email='" + email + '\'' +
                ", experience_years=" + experience_years +
                ", availability='" + availability + '\'' +
                '}';
    }
}
