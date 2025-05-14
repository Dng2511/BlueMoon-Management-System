package com.example.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.YearMonth;

@Getter
@Setter
@Entity
@Table(name = "fees")
public class Fee extends BaseModel{
    private String type; // Phí quản lý, gửi xe...
    private Integer amount;
    private YearMonth month;
    private String description;

}

