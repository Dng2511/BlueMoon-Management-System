package com.example.backend.repositories;

import com.example.backend.models.Payment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Override
    Page<Payment> findAll(Pageable pageable);

    Page<Payment> findByFeeId(Pageable pageable, Long feeId);

    @Query("SELECT p FROM Payment p " +
            "JOIN p.fee f " +
            "JOIN p.resident r " +
            "JOIN r.apartment a " +
            "WHERE (:feeType IS NULL OR f.type LIKE %:feeType%) " +
            "AND (:resident IS NULL OR r.cccd LIKE %:resident% OR r.fullName LIKE %:resident%) " +
            "AND (:apartmentName IS NULL OR a.name LIKE %:apartmentName%)")
    Page<Payment> searchPayments(
            @Param("feeType") String feeType,
            @Param("resident") String residentId,
            @Param("apartmentName") String apartmentName,
            Pageable pageable);
}
