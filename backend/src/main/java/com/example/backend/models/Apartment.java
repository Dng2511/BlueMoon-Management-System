package com.example.backend.models;

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

    private String name;

    @OneToMany(mappedBy = "apartment")
    private List<Resident> residents;
}
