package com.example.backend.repositories;

import com.example.backend.models.Apartment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    @Override
    Page<Apartment> findAll(Pageable pageable);
}
