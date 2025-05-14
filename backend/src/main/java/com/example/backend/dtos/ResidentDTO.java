package com.example.backend.dtos;

import com.example.backend.models.Apartment;
import com.example.backend.models.Resident;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDate;


@Data
@NoArgsConstructor
@AllArgsConstructor

public class ResidentDTO {
    private Long id;
    private String fullName;
    private LocalDate dob;
    private String cccd;

    @JsonProperty("phoneNumber")
    private String phoneNumber;
    private String gender;
    private String occupation;
    private ResApartment apartment;
    private String relation;


    public static ResidentDTO fromEntity(Resident resident) {
        return new ResidentDTO(
                resident.getId(),
                resident.getFullName(),
                resident.getDob(),
                resident.getCccd(),
                resident.getPhoneNumber(),
                resident.getGender(),
                resident.getOccupation(),
                resident.getApartment() != null ? new ResApartment(resident.getApartment()) : null,
                resident.getRelation() != null ? resident.getRelation().name() : null
        );
    }

    @Setter
    @Getter
    static class ResApartment {
        private Long id;
        private String name;

        public ResApartment(Apartment apartment) {
            this.id = apartment.getId();
            this.name = apartment.getName();
        }

    }
}


