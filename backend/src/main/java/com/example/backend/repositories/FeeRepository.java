package com.example.backend.repositories;

import com.example.backend.models.Fee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.YearMonth;
import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, Long> {
    @Override
    Page<Fee> findAll(Pageable pageable);

    @Query("SELECT f FROM Fee f WHERE (f.month = :month AND f.year = :year)")
    List<Fee> findByMonth(Integer year, Integer month);

    @Query("SELECT f FROM Fee f WHERE (:type IS NULL OR f.type LIKE %:type%)")
    Page<Fee> findByTypeContaining(@Param("type") String type, Pageable pageable);

    @Query("SELECT COUNT(f) from Fee f WHERE f.month =:month")
    Long countBy(@Param("month") Integer month);
}
