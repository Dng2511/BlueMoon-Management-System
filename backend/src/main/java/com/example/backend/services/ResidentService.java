package com.example.backend.services;

import com.example.backend.dtos.ResidentDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ResidentService {
    public Page<ResidentDTO> getAllResidents(Pageable pageable);

    public ResidentDTO getResident(Long id);

    public ResidentDTO saveResident(JsonNode data);

    public ResidentDTO updateResident(JsonNode data, Long id);

    public void deleteResident(Long id);
}
