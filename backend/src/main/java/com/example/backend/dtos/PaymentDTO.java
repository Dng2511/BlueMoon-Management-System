package com.example.backend.dtos;

import com.example.backend.models.Fee;
import com.example.backend.models.Payment;
import com.example.backend.models.Resident;
import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentDTO {
    private Long id;
    private Integer quantity;
    private ApaPayment apaPayment;
    private ApaFee apaFee;
    private Integer amountPaid;
    private String status;
    private String paymentMethod;
    private LocalDate datePaid;

    public static PaymentDTO fromEntity(Payment payment) {
        return new PaymentDTO(
                payment.getId(),
                payment.getQuantity(),
                new ApaPayment(payment.getResident()),
                new ApaFee(payment.getFee()),
                payment.getAmountPaid(),
                payment.getStatus(),
                payment.getPaymentMethod(),
                payment.getDatePaid()

        );
    }




    @Getter
    @Setter
    static class ApaPayment{
        private Long id;
        private String fullName;

        public ApaPayment(Resident resident){
            this.id = resident.getId();
            this.fullName = resident.getFullName();
        }
    }

    @Getter
    @Setter
    static class ApaFee{
        private Long id;
        private String type;

        public ApaFee(Fee fee) {
            this.id = fee.getId();
            this.type = fee.getType();
        }
    }

}
