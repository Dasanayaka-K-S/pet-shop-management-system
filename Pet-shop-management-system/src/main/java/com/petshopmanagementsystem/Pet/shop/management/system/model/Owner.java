package com.petshopmanagementsystem.Pet.shop.management.system.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "owner_table")
public class Owner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long owner_id;
    private String owner_name;
    private String owner_address;
    private String owner_email;
    private String owner_phone;
    private String created_at;
    private String updated_at;

//    @OneToMany(mappedBy = "owner")
//    @JsonManagedReference  // Add this
//    private List<Pet> pets;

    public Owner(String updated_at, String created_at, String owner_phone, String owner_email, String owner_address, String owner_name, Long owner_id) {
        this.updated_at = updated_at;
        this.created_at = created_at;
        this.owner_phone = owner_phone;
        this.owner_email = owner_email;
        this.owner_address = owner_address;
        this.owner_name = owner_name;
        this.owner_id = owner_id;
    }

    public Owner() {

    }

    public String getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(String updated_at) {
        this.updated_at = updated_at;
    }

    public String getCreated_at() {
        return created_at;
    }

    public void setCreated_at(String created_at) {
        this.created_at = created_at;
    }

    public String getOwner_phone() {
        return owner_phone;
    }

    public void setOwner_phone(String owner_phone) {
        this.owner_phone = owner_phone;
    }

    public String getOwner_email() {
        return owner_email;
    }

    public void setOwner_email(String owner_email) {
        this.owner_email = owner_email;
    }

    public String getOwner_address() {
        return owner_address;
    }

    public void setOwner_address(String owner_address) {
        this.owner_address = owner_address;
    }

    public String getOwner_name() {
        return owner_name;
    }

    public void setOwner_name(String owner_name) {
        this.owner_name = owner_name;
    }

    public Long getOwner_id() {
        return owner_id;
    }

    public void setOwner_id(Long owner_id) {
        this.owner_id = owner_id;
    }

    @Override
    public String toString() {
        return "Owner{" +
                "Owner_id=" + owner_id +
                ", Owner_name='" + owner_name + '\'' +
                ", Owner_address='" + owner_address + '\'' +
                ", Owner_email='" + owner_email + '\'' +
                ", Owner_phone='" + owner_phone + '\'' +
                ", created_at='" + created_at + '\'' +
                ", updated_at='" + updated_at + '\'' +
                '}';
    }
}
