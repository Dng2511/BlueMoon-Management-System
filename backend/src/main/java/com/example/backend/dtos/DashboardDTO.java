package com.example.backend.dtos;

import com.example.backend.dtos.subDTO.PaymentGroupByStatus;
import com.example.backend.dtos.subDTO.ResidentGroupByRelation;
import com.example.backend.dtos.subDTO.ResidentGroupByStayStatus;
import com.example.backend.dtos.subDTO.Revenue;
import com.example.backend.models.Vehicle;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

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

    private ResidentGroupByStayStatus residentGroupByStayStatus;

    private ResidentGroupByRelation residentGroupByRelation;

    private Long totalFee;

    private PaymentGroupByStatus paymentGroupByStatus;

    private List<Revenue> monthlyRevenues;

    private List<Revenue> annualRevenues;

}
