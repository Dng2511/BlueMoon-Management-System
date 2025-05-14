package com.example.backend.services;

import com.example.backend.dtos.ApartmentDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ApartmentService {
    public Page<ApartmentDTO> getAllApartments(Pageable pageable);

    public ApartmentDTO getApartment(Long id);

    public ApartmentDTO saveApartment(JsonNode data);

    public ApartmentDTO updateApartment(JsonNode data, Long id);

    public void deleteApartment(Long id);
}

