package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.Appointment;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Pet;
import com.petshopmanagementsystem.Pet.shop.management.system.model.Vet;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.AppointmentRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepo appointmentRepo;

    @Autowired
    private petService petService;

    @Autowired
    private vetService vetService;

    // ✅ Constants for business logic
    private static final int DEFAULT_APPOINTMENT_DURATION = 30; // minutes
    private static final int MIN_APPOINTMENT_GAP = 15; // minutes buffer between appointments

    public Appointment saveAppointment(Appointment appointment) {
        System.out.println("=== New Appointment Request ===");

        // ✅ Set default values
        if (appointment.getDuration_minutes() == null) {
            appointment.setDuration_minutes(DEFAULT_APPOINTMENT_DURATION);
        }

        // ✅ Set pet and vet entities
        setPetAndVetEntities(appointment);

        // ✅ Validate appointment date
        validateAppointmentDate(appointment);

        // ✅ Calculate end time
        appointment.calculateEndTime();

        // ✅ Check vet availability with detailed validation
        validateVetAvailability(appointment);

        // ✅ Set initial status
        if (appointment.getStatus() == null || appointment.getStatus().isEmpty()) {
            appointment.setStatus("Scheduled");
        }

        Appointment saved = appointmentRepo.save(appointment);
        enrichAppointment(saved);

        System.out.println("✅ Appointment created successfully: ID=" + saved.getAppointment_id());
        return saved;
    }

    public Appointment findAppointmentById(int id) {
        Appointment appointment = appointmentRepo.findById(id).orElse(null);
        if (appointment != null) {
            enrichAppointment(appointment);
        }
        return appointment;
    }

    public List<Appointment> findAllAppointments() {
        List<Appointment> appointments = appointmentRepo.findAll();
        return appointments.stream()
                .map(this::enrichAppointment)
                .collect(Collectors.toList());
    }

    public Appointment updateAppointment(Appointment appointment) {
        System.out.println("=== Update Appointment Request: ID=" + appointment.getAppointment_id() + " ===");

        // ✅ Check if appointment exists
        Appointment existing = appointmentRepo.findById(appointment.getAppointment_id()).orElse(null);
        if (existing == null) {
            throw new RuntimeException("Appointment not found with ID: " + appointment.getAppointment_id());
        }

        // ✅ Set pet and vet entities
        setPetAndVetEntities(appointment);

        // ✅ If changing date/time, validate again
        if (appointment.getAppointment_date() != null &&
                !appointment.getAppointment_date().equals(existing.getAppointment_date())) {
            validateAppointmentDate(appointment);
            appointment.calculateEndTime();
            validateVetAvailabilityForUpdate(appointment);
        }

        // ✅ Auto-update status based on time
        autoUpdateStatus(appointment);

        // ✅ Update timestamp
        appointment.setUpdated_at(LocalDateTime.now());

        Appointment updated = appointmentRepo.save(appointment);
        enrichAppointment(updated);

        System.out.println("✅ Appointment updated successfully");
        return updated;
    }

    public void deleteAppointment(int id) {
        Appointment appointment = appointmentRepo.findById(id).orElse(null);
        if (appointment != null) {
            System.out.println("🗑️ Deleting appointment: ID=" + id);
            appointmentRepo.deleteById(id);
        }
    }

    // ✅ NEW: Get available time slots for a vet on a specific date
    public List<String> getAvailableTimeSlots(int vetId, LocalDateTime date) {
        // Implementation for showing available slots to frontend
        // This is a placeholder - you can enhance it based on vet's working hours
        return List.of("09:00", "10:00", "11:00", "14:00", "15:00", "16:00");
    }

    // ✅ NEW: Get vet's schedule for a day
    public List<Appointment> getVetScheduleForDay(int vetId, LocalDateTime date) {
        List<Appointment> allAppointments = appointmentRepo.findActiveAppointmentsByVetId(vetId);
        LocalDateTime dayStart = date.toLocalDate().atStartOfDay();
        LocalDateTime dayEnd = dayStart.plusDays(1);

        return allAppointments.stream()
                .filter(apt -> apt.getAppointment_date().isAfter(dayStart)
                        && apt.getAppointment_date().isBefore(dayEnd))
                .collect(Collectors.toList());
    }

    // ============ PRIVATE HELPER METHODS ============

    private void setPetAndVetEntities(Appointment appointment) {
        // Set Pet
        if (appointment.getPet() == null && appointment.getPetIdForJson() != null) {
            Pet pet = petService.findPetById(appointment.getPetIdForJson());
            if (pet == null) {
                throw new RuntimeException("Pet not found with ID: " + appointment.getPetIdForJson());
            }
            appointment.setPet(pet);
        }

        // Set Vet
        if (appointment.getVet() == null && appointment.getVetIdForJson() != null) {
            Vet vet = vetService.getVetById(appointment.getVetIdForJson());
            if (vet == null) {
                throw new RuntimeException("Veterinarian not found with ID: " + appointment.getVetIdForJson());
            }
            appointment.setVet(vet);
        }
    }

    private void validateAppointmentDate(Appointment appointment) {
        if (appointment.getAppointment_date() == null) {
            throw new RuntimeException("Appointment date and time is required");
        }

        LocalDateTime now = LocalDateTime.now();

        // ✅ Cannot book appointments in the past
        if (appointment.getAppointment_date().isBefore(now)) {
            throw new RuntimeException("Cannot book appointments in the past. Please select a future date and time.");
        }

        // ✅ Cannot book too far in advance (e.g., more than 6 months)
        LocalDateTime sixMonthsFromNow = now.plusMonths(6);
        if (appointment.getAppointment_date().isAfter(sixMonthsFromNow)) {
            throw new RuntimeException("Cannot book appointments more than 6 months in advance.");
        }

        // ✅ Check business hours (assuming 9 AM - 5 PM)
        int hour = appointment.getAppointment_date().getHour();
        if (hour < 9 || hour >= 17) {
            throw new RuntimeException("Appointments can only be booked between 9:00 AM and 5:00 PM.");
        }
    }

    private void validateVetAvailability(Appointment newAppointment) {
        if (newAppointment.getVet() == null) {
            throw new RuntimeException("Veterinarian is required for appointment");
        }

        int vetId = newAppointment.getVet().getVet_id();
        String vetName = newAppointment.getVet().getVet_name();

        System.out.println("🔍 Checking availability for: " + vetName);

        // ✅ Get all overlapping appointments
        List<Appointment> overlapping = appointmentRepo.findOverlappingAppointments(
                vetId,
                newAppointment.getAppointment_date(),
                newAppointment.getAppointment_end_time()
        );

        if (!overlapping.isEmpty()) {
            Appointment conflicting = overlapping.get(0);
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
            String conflictTime = conflicting.getAppointment_date().format(formatter);

            throw new RuntimeException(
                    String.format("❌ Dr. %s is already booked from %s to %s. " +
                                    "Please choose a different time slot or veterinarian.",
                            vetName,
                            conflicting.getAppointment_date().format(DateTimeFormatter.ofPattern("hh:mm a")),
                            conflicting.getAppointment_end_time().format(DateTimeFormatter.ofPattern("hh:mm a")))
            );
        }

        // ✅ Check if vet has too many appointments on this day (max 8 per day)
        List<Appointment> daySchedule = getVetScheduleForDay(vetId, newAppointment.getAppointment_date());
        if (daySchedule.size() >= 8) {
            throw new RuntimeException(
                    String.format("❌ Dr. %s has reached maximum appointments for this day. " +
                            "Please select a different date or veterinarian.", vetName)
            );
        }

        System.out.println("✅ Vet is available for booking");
    }

    private void validateVetAvailabilityForUpdate(Appointment updatingAppointment) {
        if (updatingAppointment.getVet() == null) {
            throw new RuntimeException("Veterinarian is required for appointment");
        }

        int vetId = updatingAppointment.getVet().getVet_id();
        int currentAppointmentId = updatingAppointment.getAppointment_id();
        String vetName = updatingAppointment.getVet().getVet_name();

        // ✅ Get overlapping appointments (excluding current one)
        List<Appointment> overlapping = appointmentRepo.findOverlappingAppointments(
                vetId,
                updatingAppointment.getAppointment_date(),
                updatingAppointment.getAppointment_end_time()
        );

        overlapping = overlapping.stream()
                .filter(apt -> apt.getAppointment_id() != currentAppointmentId)
                .collect(Collectors.toList());

        if (!overlapping.isEmpty()) {
            Appointment conflicting = overlapping.get(0);
            throw new RuntimeException(
                    String.format("❌ Dr. %s is already booked from %s to %s. " +
                                    "Please choose a different time slot.",
                            vetName,
                            conflicting.getAppointment_date().format(DateTimeFormatter.ofPattern("hh:mm a")),
                            conflicting.getAppointment_end_time().format(DateTimeFormatter.ofPattern("hh:mm a")))
            );
        }
    }

    // ✅ Auto-update status based on appointment time
    private void autoUpdateStatus(Appointment appointment) {
        if (appointment.getStatus() == null) {
            appointment.setStatus("Scheduled");
            return;
        }

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime appointmentTime = appointment.getAppointment_date();

        // If appointment time has passed and still "Scheduled", auto-mark as "In Progress"
        if ("Scheduled".equals(appointment.getStatus()) && now.isAfter(appointmentTime)) {
            appointment.setStatus("In Progress");
            System.out.println("📝 Auto-updated status to 'In Progress'");
        }
    }

    private Appointment enrichAppointment(Appointment appointment) {
        if (appointment.getPet() != null) {
            appointment.setPetName(appointment.getPet().getPet_name());
            appointment.setPetIdForJson(appointment.getPet().getPet_id());
        }
        if (appointment.getVet() != null) {
            appointment.setVetName(appointment.getVet().getVet_name());
            appointment.setVetIdForJson(appointment.getVet().getVet_id());
        }

        // ✅ Calculate end time if not set
        if (appointment.getAppointment_end_time() == null) {
            appointment.calculateEndTime();
        }

        return appointment;
    }
}