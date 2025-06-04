package com.example.backend.repositories;


import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.backend.dtos.subDTO.Revenue;
import com.example.backend.models.Payment;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    @Override
    Page<Payment> findAll(Pageable pageable);

    Page<Payment> findByFeeId(Pageable pageable, Long feeId);

    List<Payment> findByFeeId(Long feeId);


    @Query("SELECT p FROM Payment p " +
            "JOIN p.fee f " +
            "JOIN p.resident r " +
            "JOIN r.apartment a " +
            "WHERE (:search IS NULL OR f.type LIKE %:search% OR r.cccd LIKE %:search% OR r.fullName LIKE %:search% OR a.name LIKE %:search%)")
    Page<Payment> searchPayments(
            @Param("search") String search,
            Pageable pageable);

    @Query("SELECT new com.example.backend.dtos.subDTO.Revenue(" +
            "CONCAT(f.month, '-', f.year), SUM(p.amountPaid)) " +
            "FROM Payment p " +
            "JOIN p.fee f " +
            "WHERE (f.year = :year AND f.month <= :month) " +
            "   OR (f.year = :previousYear AND f.month >= :month) " +
            "GROUP BY f.year, f.month " +
            "ORDER BY f.year, f.month")
    List<Revenue> getMonthlyRevenueInOneYearRange(
            @Param("month") Integer month,
            @Param("year") Integer year,
            @Param("previousYear") Integer previousYear
    );

    @Query("SELECT new com.example.backend.dtos.subDTO.Revenue(" +
            "CONCAT(f.year, ''), SUM(p.amountPaid)) " +
            "FROM Payment p " +
            "JOIN p.fee f " +
            "WHERE f.year BETWEEN :startYear AND :endYear " +
            "GROUP BY f.year " +
            "ORDER BY f.year")
    List<Revenue> getAnnualRevenue(
            @Param("startYear") Integer startYear,
            @Param("endYear") Integer endYear
    );

    @Query("SELECT COUNT(p) FROM Payment p " +
            "JOIN p.fee f " +
            "WHERE (p.status = :status AND f.month = :month AND f.year = :year) ")
    Long countPaymentByStatus(@Param("status") String status,
                              @Param("month") Integer month,
                              @Param("year") Integer year);

    @Query("SELECT COUNT(p) FROM Payment p " +
            "JOIN p.fee f " +
            "WHERE p.status = 'not yet paid' AND " +
            "(f.year < :year OR (f.year = :year AND f.month < :month))")
    Long countNotYetPaidFromPreviousMonth(@Param("month") Integer month, @Param("year") Integer year);




}
