package com.example.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@JsonPropertyOrder({
        "apartment",
        "totalResident",
        "permanentResidence",
        "temporaryResidence",
        "temporaryAbsence",
        "unregistered"
})
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
