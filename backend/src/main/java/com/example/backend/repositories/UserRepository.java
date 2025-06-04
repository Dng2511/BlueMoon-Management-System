package com.example.backend.repositories;

import com.example.backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // Medhod to find a user by email
    Optional<User> findByEmail(String email);

    // Method to check if a user exists by email
    boolean existsByEmail(String email);

    Optional<User> findByUsername(String username);
}