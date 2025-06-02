package com.example.backend.dtos.subDTO;

import com.example.backend.dtos.ResidentDTO;
import com.example.backend.models.Apartment;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({
        "id",
        "name",
        "area",
        "residentCount",
        "date_created",
        "residents"
})
public class ApartmentDetailDTO {
    private Long id;
    private String name;
    private Integer area;
    private Integer residentCount;

    @JsonProperty("date_created")
    private LocalDate dateCreated;

    @JsonIgnoreProperties("apartment")
    private List<ResidentDTO> residents;


    public static ApartmentDetailDTO fromEntity(Apartment apartment) {
        List<ResidentDTO> residentDTOs = apartment.getResidents() != null
                ? apartment.getResidents().stream().map(ResidentDTO::fromEntity).collect(Collectors.toList())
                : List.of();

        return new ApartmentDetailDTO(
                apartment.getId(),
                apartment.getName(),
                apartment.getArea(),
                apartment.getResidents() != null ? apartment.getResidents().size() : 0,
                apartment.getCreatedAt().toLocalDate(),
                residentDTOs
        );
    }
}
