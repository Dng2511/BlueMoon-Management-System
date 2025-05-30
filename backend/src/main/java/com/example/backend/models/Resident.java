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

    @Column(columnDefinition = "NVARCHAR(255)")
    private String fullName;
    private LocalDate dob;
    private String cccd;
    private String phoneNumber;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String gender;

    @Column(columnDefinition = "NVARCHAR(255)")
    private String occupation;

    private String avatar;

    @Enumerated(EnumType.STRING)
    @Column(name = "stay_status", columnDefinition = "NVARCHAR(50)")
    private StayStatus stayStatus;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Apartment apartment;

    private Relation relation;
}
