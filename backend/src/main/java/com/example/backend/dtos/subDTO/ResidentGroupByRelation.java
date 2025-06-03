package com.example.backend.dtos.subDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class ResidentGroupByRelation {
    private long owner;
    private long tenant;
    private long relative;
}

