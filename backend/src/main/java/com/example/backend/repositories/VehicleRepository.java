package com.example.backend.repositories;

import com.example.backend.models.Resident;
import com.example.backend.models.Vehicle;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    @Query("SELECT r FROM Vehicle r WHERE " +
            "(:search IS NULL OR r.license LIKE %:search%)" +
            "ORDER BY r.createdAt DESC")
    Page<Resident> findAll(Pageable pageable, @Param("search") String search);
}
