package com.petshopmanagementsystem.Pet.shop.management.system.service;

import com.petshopmanagementsystem.Pet.shop.management.system.model.User;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.userRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private userRepo userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    public User registerUser(User user) {
        // Check if username already exists
        if (userRepository.findByUsername(user.getUsername()) != null) {
            throw new RuntimeException("Username already exists");
        }

        // Validate input
        if (user.getUsername() == null || user.getUsername().trim().isEmpty()) {
            throw new RuntimeException("Username is required");
        }

        if (user.getPassword() == null || user.getPassword().length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }

        if (user.getFirstname() == null || user.getFirstname().trim().isEmpty()) {
            throw new RuntimeException("First name is required");
        }

        if (user.getLastname() == null || user.getLastname().trim().isEmpty()) {
            throw new RuntimeException("Last name is required");
        }

        // Encode password
        String encodedPassword = passwordEncoder.encode(user.getPassword());

        // Store encoded password in BOTH fields
        user.setPassword(encodedPassword);
        user.setPasswordHash(encodedPassword);

        // Save user
        return userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public boolean verifyPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public void deleteUser(int id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        userRepository.deleteById(id);
    }

    public User getUserById(int id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    public User updateUser(int id, User updatedUser) {
        User existingUser = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        // Update fields
        if (updatedUser.getFirstname() != null && !updatedUser.getFirstname().trim().isEmpty()) {
            existingUser.setFirstname(updatedUser.getFirstname());
        }

        if (updatedUser.getLastname() != null && !updatedUser.getLastname().trim().isEmpty()) {
            existingUser.setLastname(updatedUser.getLastname());
        }

        if (updatedUser.getUsername() != null && !updatedUser.getUsername().trim().isEmpty()) {
            // Check if new username already exists
            User userWithSameUsername = userRepository.findByUsername(updatedUser.getUsername());
            if (userWithSameUsername != null && userWithSameUsername.getId() != id) {
                throw new RuntimeException("Username already exists");
            }
            existingUser.setUsername(updatedUser.getUsername());
        }

        // Only update password if provided
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
            if (updatedUser.getPassword().length() < 6) {
                throw new RuntimeException("Password must be at least 6 characters");
            }
            String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
            existingUser.setPassword(encodedPassword);
            existingUser.setPasswordHash(encodedPassword);
        }

        return userRepository.save(existingUser);
    }
}