package com.example.backend.services.Impl;

import com.example.backend.dtos.ResidentDTO;
import com.example.backend.models.Apartment;
import com.example.backend.models.Relation;
import com.example.backend.models.Resident;
import com.example.backend.repositories.ApartmentRepository;
import com.example.backend.repositories.ResidentRepository;
import com.example.backend.services.ResidentService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ResidentServiceImpl implements ResidentService {
    private final ResidentRepository residentRepository;
    private final ApartmentRepository apartmentRepository;

    @Override
    public Page<ResidentDTO> getAllResidents(Pageable pageable) {
        return residentRepository.findAll(pageable).map(ResidentDTO::fromEntity);
    }

    @Override
    public ResidentDTO getResident(Long id) {
        return ResidentDTO.fromEntity(Objects.requireNonNull(residentRepository.findById(id).orElse(null)));
    }

    @Override
    public ResidentDTO saveResident(JsonNode data) {
        Resident resident = new Resident();
        resident.setFullName(data.get("fullName").asText());
        resident.setCccd(data.get("cccd").asText());
        resident.setDob(LocalDate.parse(data.get("dob").asText()));
        resident.setGender(data.get("gender").asText());
        resident.setOccupation(data.get("occupation").asText());
        resident.setPhoneNumber(data.get("phoneNumber").asText());
        resident.setRelation(Relation.valueOf(data.get("relation").asText().toUpperCase()));
        Apartment apartment = apartmentRepository.getReferenceById(data.get("apartmentId").asLong());
        resident.setApartment(apartment);
        return ResidentDTO.fromEntity(residentRepository.save(resident));
    }

    @Override
    public ResidentDTO updateResident(JsonNode data, Long id) {
        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        resident.setFullName(data.get("fullName").asText());
        resident.setCccd(data.get("cccd").asText());
        resident.setDob(LocalDate.parse(data.get("dob").asText()));
        resident.setGender(data.get("gender").asText());
        resident.setOccupation(data.get("occupation").asText());
        resident.setPhoneNumber(data.get("phoneNumber").asText());
        resident.setRelation(Relation.valueOf(data.get("relation").asText().toUpperCase()));
        Apartment apartment = apartmentRepository.getReferenceById(data.get("apartmentId").asLong());
        resident.setApartment(apartment);
        return ResidentDTO.fromEntity(residentRepository.save(resident));
    }

    @Override
    public void deleteResident(Long id) {
        residentRepository.deleteById(id);
    }
}
