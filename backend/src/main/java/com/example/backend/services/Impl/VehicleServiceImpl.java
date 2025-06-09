package com.example.backend.services.Impl;

import com.example.backend.dtos.VehicleDTO;
import com.example.backend.models.Apartment;
import com.example.backend.models.Vehicle;
import com.example.backend.models.enums.VehicleType;
import com.example.backend.repositories.ApartmentRepository;
import com.example.backend.repositories.VehicleRepository;
import com.example.backend.services.VehicleService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VehicleServiceImpl implements VehicleService {
    private final VehicleRepository vehicleRepository;
    private final ApartmentRepository apartmentRepository;
    @Override
    public Page<VehicleDTO> getAllVehicles(Pageable pageable) {
        return vehicleRepository.findAll(pageable).map(VehicleDTO::fromEntity);
    }

    @Override
    public VehicleDTO createVehicle(JsonNode data) {
        Apartment apartment = apartmentRepository.findById(data.get("apartmentId").asLong())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));

        Vehicle vehicle = new Vehicle();
        vehicle.setApartment(apartment);
        vehicle.setLicense(data.get("license").asText());
        vehicle.setVehicleType(VehicleType.valueOf(data.get("type").asText().toUpperCase()));


        return VehicleDTO.fromEntity(vehicleRepository.save(vehicle));
    }

    @Override
    public VehicleDTO updateVehicle(JsonNode data, Long id) {

        Vehicle vehicle = vehicleRepository.findById(id).orElseThrow(() -> new RuntimeException("Vehicle not found"));

        Apartment apartment = apartmentRepository.findById(data.get("apartmentId").asLong())
                .orElseThrow(() -> new RuntimeException("Apartment not found"));


        vehicle.setApartment(apartment);
        vehicle.setLicense(data.get("license").asText());
        vehicle.setVehicleType(VehicleType.valueOf(data.get("type").asText().toUpperCase()));


        return VehicleDTO.fromEntity(vehicleRepository.save(vehicle));
    }

    @Override
    public void deleteVehicle(Long id) {
        vehicleRepository.deleteById(id);
    }
}
