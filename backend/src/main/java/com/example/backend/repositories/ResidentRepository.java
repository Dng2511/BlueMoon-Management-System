package com.example.backend.repositories;

import com.example.backend.models.Resident;
import com.example.backend.models.StayStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ResidentRepository extends JpaRepository<Resident, Long> {
    @Query("SELECT r FROM Resident r WHERE " +
            "(:search IS NULL OR r.fullName LIKE %:search% OR r.cccd LIKE %:search%) AND " +
            "(:gender IS NULL OR r.gender = :gender) " +
            "ORDER BY r.createdAt DESC")
    Page<Resident> findAll(Pageable pageable, @Param("search") String search, @Param("gender") String gender);

    @Query("SELECT COUNT(r) FROM Resident r WHERE r.stayStatus = :status")
    long countByStayStatus(@Param("status") StayStatus status);

    List<Resident> findByRelationIn(List<String> owner);

    @Query("SELECT COUNT(r) FROM Resident r WHERE r.stayStatus IS NULL")
    long countByStayStatusIsNull();
}
