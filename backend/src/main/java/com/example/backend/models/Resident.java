package com.example.backend.models;

import ch.qos.logback.core.model.Model;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "residents")
public class Resident extends BaseModel {

    private String fullName;
    private LocalDate dob;
    private String cccd;
    private String phoneNumber;
    private String gender;
    private String occupation;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Apartment apartment;

    private Relation relation;
}
