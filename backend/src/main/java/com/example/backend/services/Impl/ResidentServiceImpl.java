package com.example.backend.services.Impl;

import com.example.backend.dtos.ResidentDTO;
import com.example.backend.models.Apartment;
import com.example.backend.models.Relation;
import com.example.backend.models.Resident;
import com.example.backend.models.StayStatus;
import com.example.backend.repositories.ApartmentRepository;
import com.example.backend.repositories.ResidentRepository;
import com.example.backend.services.ResidentService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ResidentServiceImpl implements ResidentService {
    private final ResidentRepository residentRepository;
    private final ApartmentRepository apartmentRepository;

    @Override
    public Page<ResidentDTO> getAllResidents(Pageable pageable, String search, String gender) {
        return residentRepository.findAll(pageable, search, gender).map(ResidentDTO::fromEntity);
    }

    @Override
    public ResidentDTO getResident(Long id) {
        return ResidentDTO.fromEntity(Objects.requireNonNull(residentRepository.findById(id).orElse(null)));
    }

    @Override
    public ResidentDTO saveResident(JsonNode data)  {
        Resident resident = new Resident();
        resident.setFullName(data.get("fullName").asText());
        resident.setCccd(data.get("cccd").asText());
        resident.setDob(LocalDate.parse(data.get("dob").asText()));
        resident.setGender(data.get("gender").asText());
        resident.setOccupation(data.get("occupation").asText());
        resident.setPhoneNumber(data.get("phoneNumber").asText());
        resident.setRelation(Relation.valueOf(data.get("relation").asText().toUpperCase()));
        resident.setStayStatus(StayStatus.valueOf(data.get("stay_status").asText().toUpperCase()));
        Apartment apartment = apartmentRepository.getReferenceById(data.get("apartmentId").asLong());
        resident.setApartment(apartment);
        resident.setAvatar("default.jpg");
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
        resident.setStayStatus(StayStatus.valueOf(data.get("stay_status").asText().toUpperCase()));
        Apartment apartment = apartmentRepository.getReferenceById(data.get("apartmentId").asLong());
        resident.setApartment(apartment);
        return ResidentDTO.fromEntity(residentRepository.save(resident));
    }

    @Override
    public ResidentDTO updateResident(Long id, MultipartFile imageFile) {

        Resident resident = residentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        try{

            String folderPath = new ClassPathResource("static/images/").getFile().getAbsolutePath();
            String fileName = UUID.randomUUID() + "_" + imageFile.getOriginalFilename();

            String oldImage = resident.getAvatar();
            if (oldImage != null && !oldImage.equals("defaultImg")) {
                Path oldImagePath = Paths.get(folderPath, oldImage);
                Files.deleteIfExists(oldImagePath);
            }

            Path filePath = Paths.get(folderPath, fileName);
            Files.copy(imageFile.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            resident.setAvatar(fileName);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return ResidentDTO.fromEntity(residentRepository.save(resident));
    }

    @Override
    public void deleteResident(Long id) {
        residentRepository.deleteById(id);
    }
}
