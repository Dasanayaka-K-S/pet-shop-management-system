package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Treatment;
import com.petshopmanagementsystem.Pet.shop.management.system.service.TreatmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/app")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class TreatmentController {

    @Autowired
    private TreatmentService treatmentService;

    @PostMapping("/addTreatment")
    public ResponseEntity<Map<String, Object>> addTreatment(@RequestBody Treatment treatment) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("📥 Received treatment request: " + treatment);
            Treatment saved = treatmentService.saveTreatment(treatment);

            response.put("success", true);
            response.put("message", "Treatment record created successfully!");
            response.put("treatment", saved);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            System.err.println("❌ Error creating treatment: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to save treatment record. Please try again.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTreatments")
    public ResponseEntity<Map<String, Object>> getAllTreatments() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Treatment> treatments = treatmentService.findAllTreatments();

            response.put("success", true);
            response.put("treatments", treatments);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error fetching treatments: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to fetch treatments");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTreatment/{id}")
    public ResponseEntity<Map<String, Object>> getTreatmentById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Treatment treatment = treatmentService.findTreatmentById(id);
            if (treatment == null) {
                response.put("success", false);
                response.put("message", "Treatment record not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            response.put("success", true);
            response.put("treatment", treatment);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error fetching treatment: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to fetch treatment record");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTreatmentsByAppointment/{appointmentId}")
    public ResponseEntity<Map<String, Object>> getTreatmentsByAppointment(@PathVariable int appointmentId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Treatment> treatments = treatmentService.findByAppointmentId(appointmentId);

            response.put("success", true);
            response.put("treatments", treatments);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error fetching treatments: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to fetch treatments");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getTreatmentsByPet/{petId}")
    public ResponseEntity<Map<String, Object>> getTreatmentsByPet(@PathVariable int petId) {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Treatment> treatments = treatmentService.findByPetId(petId);

            response.put("success", true);
            response.put("treatments", treatments);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error fetching treatments: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to fetch treatments");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getUpcomingFollowUps")
    public ResponseEntity<Map<String, Object>> getUpcomingFollowUps() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Treatment> treatments = treatmentService.findUpcomingFollowUps();

            response.put("success", true);
            response.put("treatments", treatments);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error fetching follow-ups: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to fetch follow-ups");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateTreatment")
    public ResponseEntity<Map<String, Object>> updateTreatment(@RequestBody Treatment treatment) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("📝 Updating treatment: " + treatment.getTreatment_id());
            Treatment updated = treatmentService.updateTreatment(treatment);

            response.put("success", true);
            response.put("message", "Treatment record updated successfully!");
            response.put("treatment", updated);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            System.err.println("❌ Error updating treatment: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update treatment record");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteTreatment/{id}")
    public ResponseEntity<Map<String, Object>> deleteTreatment(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Treatment treatment = treatmentService.findTreatmentById(id);
            if (treatment == null) {
                response.put("success", false);
                response.put("message", "Treatment record not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            treatmentService.deleteTreatment(id);

            response.put("success", true);
            response.put("message", "Treatment record deleted successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error deleting treatment: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to delete treatment record");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}