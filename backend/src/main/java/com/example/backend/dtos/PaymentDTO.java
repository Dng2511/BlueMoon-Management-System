package com.example.backend.dtos;

import com.example.backend.models.Fee;
import com.example.backend.models.Payment;
import com.example.backend.models.Resident;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonPropertyOrder({
        "id",
        "quantity",
        "resident",
        "fee",
        "amountPaid",
        "status",
        "date_paid"
})
public class PaymentDTO {
    private Long id;
    private Integer quantity;
    private ResPayment resident;
    private FeePayment fee;
    private Integer amountPaid;
    @JsonProperty("status")
    private String status;
    @JsonProperty("date_paid")
    private LocalDate datePaid;

    public static PaymentDTO fromEntity(Payment payment) {
        return new PaymentDTO(
                payment.getId(),
                payment.getQuantity(),
                new ResPayment(payment.getResident()),
                new FeePayment(payment.getFee()),
                payment.getAmountPaid(),
                payment.getStatus(),
                payment.getDatePaid()
        );
    }


    @Getter
    @Setter
    public static class ResPayment{
        private Long id;
        private String fullName;
        private String apartment;

        public ResPayment(Resident resident){
            this.id = resident.getId();
            this.fullName = resident.getFullName();
            this.apartment = resident.getApartment().getName();
        }
    }

    @Getter
    @Setter
    static class FeePayment{
        private Long id;
        private String type;

        public FeePayment(Fee fee) {
            this.id = fee.getId();
            this.type = fee.getType();
        }
    }

}
