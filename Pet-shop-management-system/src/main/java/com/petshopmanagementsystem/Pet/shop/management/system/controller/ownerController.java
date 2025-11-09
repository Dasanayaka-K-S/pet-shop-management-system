package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Owner;
import com.petshopmanagementsystem.Pet.shop.management.system.service.ownerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/app/")
@CrossOrigin(origins = "http://localhost:3000")
public class ownerController {

    @Autowired
    private ownerService ownerService;

    @PostMapping("/saveOwner")
    public Owner saveOwner(@RequestBody Owner owner) {
        return ownerService.saveOwner(owner);
    }

    @GetMapping("/getOwner/{id}")
    public Owner getOwner(@PathVariable int id) {
        return ownerService.findOwnerById(id);
    }

    @GetMapping("/getOwners")
    public List<Owner> getOwners() {
        return ownerService.findAllOwners();
    }

    @PutMapping("/updateOwner")
    public Owner updateOwner(@RequestBody Owner owner) {
        return ownerService.updateOwner(owner);
    }

}
