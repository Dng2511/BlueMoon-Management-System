package com.example.backend.services;

import com.example.backend.dtos.ResidentDTO;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface ResidentService {
    public Page<ResidentDTO> getAllResidents(Pageable pageable, String search, String gender);

    public ResidentDTO getResident(Long id);

    public ResidentDTO saveResident(JsonNode data);

    public ResidentDTO updateResident(JsonNode data, Long id);

    public ResidentDTO updateResident(Long id, MultipartFile imageFile);

    public void deleteResident(Long id);
}
