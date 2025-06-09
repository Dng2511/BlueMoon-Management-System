package com.example.backend.services;

import com.example.backend.dtos.VehicleDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface VehicleService {
    Page<VehicleDTO> getAllVehicles(Pageable pageable);

    public VehicleDTO createVehicle(JsonNode data);

    public VehicleDTO updateVehicle(JsonNode  data, Long id);

    public void deleteVehicle(Long id);
}
