package com.example.backend.dtos;

import com.example.backend.models.Apartment;
import com.example.backend.models.Resident;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({
        "id",
        "name",
        "area"
})
public class ApartmentDTO {
    private Long id;

    private String name;

    private Integer area;

    public static ApartmentDTO fromEntity(Apartment apartment) {
        ApartmentDTO dto = new ApartmentDTO();

        dto.setId(apartment.getId());
        dto.setName(apartment.getName());
        dto.setArea(apartment.getArea());

        return dto;
    }
}
