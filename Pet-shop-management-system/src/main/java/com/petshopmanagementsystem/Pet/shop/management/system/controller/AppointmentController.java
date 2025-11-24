package com.petshopmanagementsystem.Pet.shop.management.system.controller;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import com.petshopmanagementsystem.Pet.shop.management.system.service.AppointmentService;
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
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @PostMapping("/addAppointment")
    public ResponseEntity<Map<String, Object>> addAppointment(@RequestBody Appointment appointment) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("📥 Received appointment request: " + appointment);
            Appointment saved = appointmentService.saveAppointment(appointment);

            response.put("success", true);
            response.put("message", "Appointment booked successfully!");
            response.put("appointment", saved);

            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            // ✅ Return the actual error message from service validation
            System.err.println("❌ Error creating appointment: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to save appointment. Please try again.");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAppointments")
    public ResponseEntity<Map<String, Object>> getAllAppointments() {
        Map<String, Object> response = new HashMap<>();
        try {
            List<Appointment> appointments = appointmentService.findAllAppointments();

            response.put("success", true);
            response.put("appointments", appointments);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error fetching appointments: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to fetch appointments");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/getAppointment/{id}")
    public ResponseEntity<Map<String, Object>> getAppointmentById(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Appointment appointment = appointmentService.findAppointmentById(id);
            if (appointment == null) {
                response.put("success", false);
                response.put("message", "Appointment not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            response.put("success", true);
            response.put("appointment", appointment);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error fetching appointment: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to fetch appointment");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping("/updateAppointment")
    public ResponseEntity<Map<String, Object>> updateAppointment(@RequestBody Appointment appointment) {
        Map<String, Object> response = new HashMap<>();
        try {
            System.out.println("📝 Updating appointment: " + appointment.getAppointment_id());
            Appointment updated = appointmentService.updateAppointment(appointment);

            response.put("success", true);
            response.put("message", "Appointment updated successfully!");
            response.put("appointment", updated);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (RuntimeException e) {
            System.err.println("❌ Error updating appointment: " + e.getMessage());
            response.put("success", false);
            response.put("message", e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            System.err.println("❌ Unexpected error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to update appointment");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/deleteAppointment/{id}")
    public ResponseEntity<Map<String, Object>> deleteAppointment(@PathVariable int id) {
        Map<String, Object> response = new HashMap<>();
        try {
            Appointment appointment = appointmentService.findAppointmentById(id);
            if (appointment == null) {
                response.put("success", false);
                response.put("message", "Appointment not found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }

            appointmentService.deleteAppointment(id);

            response.put("success", true);
            response.put("message", "Appointment deleted successfully");

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("❌ Error deleting appointment: " + e.getMessage());
            response.put("success", false);
            response.put("message", "Failed to delete appointment");
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}