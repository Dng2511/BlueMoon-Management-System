package com.example.backend.models;

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
    private String paymentMethod;

    protected void onCreate() {
        int sum = 0;
        if("electricity".equals(this.fee.getType())){
            if (quantity > 400) {
                sum += (quantity - 400) * 2927;
                quantity = 400;
            }
            if (quantity > 300) {
                sum += (quantity - 300) * 2834;
                quantity = 300;
            }
            if (quantity > 200) {
                sum += (quantity - 200) * 2536;
                quantity = 200;
            }
            if (quantity > 100) {
                sum += (quantity - 100) * 2014;
                quantity = 100;
            }
            if (quantity > 50) {
                sum += (quantity - 50) * 1734;
                quantity = 50;
            }
            sum += quantity * 1678;
        } else {sum = quantity* fee.getAmount();};

        this.amountPaid = sum;
    }
}

