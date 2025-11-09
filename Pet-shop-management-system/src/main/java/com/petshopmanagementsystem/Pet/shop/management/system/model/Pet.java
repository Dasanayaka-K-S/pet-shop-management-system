package com.petshopmanagementsystem.Pet.shop.management.system.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "pet_table")
public class Pet {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonProperty("pet_id")
    private int pet_id;

    @JsonProperty("pet_name")
    private String pet_name;

    private String species;
    private String breed;
    private int age;
    private String gender;

    @JsonProperty("registered_date")
    private Date registerd_date;

    @ManyToOne
    @JoinColumn(name = "owner_id", referencedColumnName = "owner_id")
    @JsonBackReference
    private Owner owner;

    public Pet() {
    }

    public Pet(Owner owner, Date registerd_date, String gender, int age, String breed, String species, String pet_name, int pet_id) {
        this.owner = owner;
        this.registerd_date = registerd_date;
        this.gender = gender;
        this.age = age;
        this.breed = breed;
        this.species = species;
        this.pet_name = pet_name;
        this.pet_id = pet_id;
    }

    public int getPet_id() {
        return pet_id;
    }

    public void setPet_id(int pet_id) {
        this.pet_id = pet_id;
    }

    public String getPet_name() {
        return pet_name;
    }

    public void setPet_name(String pet_name) {
        this.pet_name = pet_name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getRegisterd_date() {
        return registerd_date;
    }

    public void setRegisterd_date(Date registerd_date) {
        this.registerd_date = registerd_date;
    }

    public Owner getOwner() {
        return owner;
    }

    public void setOwner(Owner owner) {
        this.owner = owner;
    }

    @Override
    public String toString() {
        return "Pet{" +
                "pet_id=" + pet_id +
                ", pet_name='" + pet_name + '\'' +
                ", species='" + species + '\'' +
                ", breed='" + breed + '\'' +
                ", age=" + age +
                ", gender='" + gender + '\'' +
                ", registerd_date=" + registerd_date +
                ", owner=" + (owner != null ? owner.getOwner_id() : "null") +
                '}';
    }
}