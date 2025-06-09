package com.example.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "apartments")
public class Apartment extends BaseModel {
    private Long id;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String name;

    private Integer area;

    @OneToMany(mappedBy = "apartment")
    private List<Resident> residents;

    @OneToMany(mappedBy = "apartment")
    private List<Vehicle> vehicles;
}
