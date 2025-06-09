package com.example.backend.models;


import com.example.backend.models.enums.VehicleType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "vehicles")
public class Vehicle extends BaseModel{
    private String license;

    private VehicleType vehicleType;

    @ManyToOne
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

}
