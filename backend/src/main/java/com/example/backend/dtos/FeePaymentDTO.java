package com.example.backend.dtos;

import com.example.backend.models.Payment;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@JsonPropertyOrder({
        "id",
        "quantity",
        "resident",
        "amountPaid",
        "status",
        "date_paid"
})
public class FeePaymentDTO {
    private Long id; // Unique identifier for the payment
    private Integer quantity;
    private PaymentDTO.ResPayment resident;
    private Integer amountPaid;
    @JsonProperty("status")
    private String status;
    @JsonProperty("date_paid")
    private LocalDate datePaid;

    public static FeePaymentDTO fromEntity(Payment payment) {
        return new FeePaymentDTO(
                payment.getId(),
                payment.getQuantity(),
                new PaymentDTO.ResPayment(payment.getResident()),
                payment.getAmountPaid(),
                payment.getStatus(),
                payment.getDatePaid()
        );
    }
}
