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

    /**
     * param:
     * - feeType: Loại phí (ex: Tinh+nguyen)
     * - resident: CCCD hoặc fullName (ex: 0123/Pham+Van)
     * - apartmentName: tên căn hộ (ex: Nha+4, Nha+5, ...)
     * ex api: http://localhost:8000/payments/search?feeType=siu&resident=Pham+Van&apartmentName=Nha+5
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
    **/

    @Query("SELECT p FROM Payment p " +
            "JOIN p.fee f " +
            "JOIN p.resident r " +
            "JOIN r.apartment a " +
            "WHERE (:value IS NULL OR " +
            "      f.type LIKE %:value% OR " +
            "      r.cccd LIKE %:value% OR " +
            "      r.fullName LIKE %:value% OR " +
            "      a.name LIKE %:value%)")
    Page<Payment> searchPayments(
            @Param("value") String value,
            Pageable pageable);
}
