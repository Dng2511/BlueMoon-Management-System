package com.example.backend.dtos.subDTO;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class Revenue {
    private String month;
    private Long revenue;
}
