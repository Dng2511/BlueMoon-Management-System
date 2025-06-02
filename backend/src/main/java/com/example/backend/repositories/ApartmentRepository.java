package com.example.backend.repositories;

import com.example.backend.models.Apartment;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
    @Query("SELECT DISTINCT a FROM Apartment a LEFT JOIN a.residents r " +
            "WHERE (:search IS NULL OR a.name LIKE %:search% OR r.fullName LIKE %:search%) " +
            "ORDER BY a.createdAt DESC")
    Page<Apartment> findAll(Pageable pageable, @Param("search") String search);
}
