package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Owner;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.ownerRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

@Service
public class ownerService {

    @Autowired
    private ownerRepo ownerRepo;

    public Owner saveOwner(Owner owner) {
        return ownerRepo.save(owner);
    }

    public  Owner findOwnerById(int id) {
        return ownerRepo.findById(id).orElse(null);
    }

    public List<Owner> findAllOwners() {
        return ownerRepo.findAll();
    }

    public Owner updateOwner(@RequestBody Owner owner) {
        return ownerRepo.save(owner);
    }

    public Owner deleteOwner(int id) {
        Owner owner = ownerRepo.findById(id).orElse(null);
        ownerRepo.delete(owner);
        return owner;
    }


}
