package com.example.backend.repositories;

import com.example.backend.models.Resident;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ResidentRepository extends JpaRepository<Resident, Long> {
    @Override
    Page<Resident> findAll(Pageable pageable);


    List<Resident> findByRelationIn(List<String> owner);
}
