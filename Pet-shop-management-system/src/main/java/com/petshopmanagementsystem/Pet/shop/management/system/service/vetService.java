package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Vet;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.vetRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class vetService {

    @Autowired
    private vetRepo vetRepo;

    public Vet addVet(Vet vet){
        return vetRepo.save(vet);
    }

    public Vet updateVet(Vet vet){
        return vetRepo.save(vet);
    }

    public void deleteVet(Vet vet){
        vetRepo.delete(vet);
    }

    public Vet getVetById(int id){
        return vetRepo.findById(id).orElse(null);
    }

    public List<Vet> getAllVets(){
        return vetRepo.findAll();
    }

    public Vet deleteVetById(int id){
        return vetRepo.findById(id).orElse(null);
    }
}
