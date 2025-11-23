package com.petshopmanagementsystem.Pet.shop.management.system.security;

import com.petshopmanagementsystem.Pet.shop.management.system.model.User;
import com.petshopmanagementsystem.Pet.shop.management.system.repo.userRepo;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class MyUserDetailsService implements UserDetailsService {

    private final userRepo userRepository;

    public MyUserDetailsService(userRepo userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("Loading user: " + username);

        User user = userRepository.findByUsername(username);

        if (user == null) {
            System.out.println("User not found: " + username);
            throw new UsernameNotFoundException("User not found: " + username);
        }

        System.out.println("User found: " + username);
        System.out.println("Password hash exists: " + (user.getPasswordHash() != null));

        return new UserPrincipal(user);
    }
}