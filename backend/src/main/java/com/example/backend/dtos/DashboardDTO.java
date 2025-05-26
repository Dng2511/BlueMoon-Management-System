package com.example.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
public class DashboardDTO {
    private long apartment;

    @JsonProperty("total_resident")
    private long totalResident;

    @JsonProperty("permanent_residence")
    private long permanentResidence;     // Thường trú

    @JsonProperty("temporary_residence")
    private long temporaryResidence;    // Tạm trú

    @JsonProperty("temporary_absence")
    private long temporaryAbsence;     // Tạm vắng

    private long unregistered;


}
