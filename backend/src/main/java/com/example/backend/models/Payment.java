package com.example.backend.models;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "payments")
public class Payment extends BaseModel{

    @ManyToOne
    private Resident resident;

    @ManyToOne
    private Fee fee;

    private Integer quantity;

    private Integer amountPaid;
    private LocalDate datePaid;
    @Column(columnDefinition = "NVARCHAR(255)")
    private String paymentMethod;
    private String status;

}

