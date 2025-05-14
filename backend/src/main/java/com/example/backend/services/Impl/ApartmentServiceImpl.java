package com.example.backend.services.Impl;

import com.example.backend.dtos.ApartmentDTO;
import com.example.backend.dtos.ResidentDTO;
import com.example.backend.models.Apartment;
import com.example.backend.repositories.ApartmentRepository;
import com.example.backend.services.ApartmentService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApartmentServiceImpl implements ApartmentService {

    private final ApartmentRepository apartmentRepository;

    @Override
    public Page<ApartmentDTO> getAllApartments(Pageable pageable) {
        return apartmentRepository.findAll(pageable).map(ApartmentDTO::fromEntity);
    }

    @Override
    public ApartmentDTO getApartment(Long id) {
        return null;
    }

    @Override
    public ApartmentDTO saveApartment(JsonNode data) {
        Apartment apartment = new Apartment();
        apartment.setName(data.get("name").asText());
        return ApartmentDTO.fromEntity(apartmentRepository.save(apartment));
    }

    @Override
    public ApartmentDTO updateApartment(JsonNode data, Long id) {
        return null;
    }

    @Override
    public void deleteApartment(Long id) {

    }
}
