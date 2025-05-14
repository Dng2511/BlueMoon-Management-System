package com.example.backend.dtos;

import com.example.backend.models.Apartment;
import com.example.backend.models.Resident;
import lombok.*;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApartmentDTO {
    private Long id;
    private String name;
    private List<ApaResident> residents;



    public static ApartmentDTO fromEntity(Apartment apartment) {
        ApartmentDTO dto = new ApartmentDTO();
        dto.id = apartment.getId();
        dto.name = apartment.getName();

        if (apartment.getResidents() != null) {
            dto.residents = apartment.getResidents()
                    .stream()
                    .map(ApaResident::new)
                    .collect(Collectors.toList());
        } else {
            dto.residents = new ArrayList<>();
        }

        return dto;
    }

    @Getter
    @Setter
    static class ApaResident{
        private Long id;
        private String fullName;
        private String relation;

        public ApaResident(Resident resident){
            this.id = resident.getId();
            this.fullName = resident.getFullName();
            this.relation = resident.getRelation().name();
        }
    }
}
