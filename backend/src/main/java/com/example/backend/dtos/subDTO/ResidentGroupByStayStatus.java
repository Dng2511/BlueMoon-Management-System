package com.example.backend.dtos.subDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ResidentGroupByStayStatus {
    @JsonProperty("permanent_residence")
    private long permanentResidence;     // Thường trú

    @JsonProperty("temporary_residence")
    private long temporaryResidence;    // Tạm trú

    @JsonProperty("temporary_absence")
    private long temporaryAbsence;     // Tạm vắng

    private long unregistered;
}
