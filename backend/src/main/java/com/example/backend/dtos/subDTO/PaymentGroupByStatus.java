package com.example.backend.dtos.subDTO;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
public class PaymentGroupByStatus {

    @JsonProperty("cash")
    private Long cash;

    @JsonProperty("bank_transfer")
    private Long bankTransfer;

    @JsonProperty("credit_card")
    private Long creditCard;

    @JsonProperty("not_yet_paid_this_month")
    private Long notYetPaidThisMonth;

    @JsonProperty("other")
    private Long other;

    @JsonProperty("not_yet_paid_previous_month")
    private Long notYetPaidPreviousMonth;



    // Constructors, Getters, Setters như cũ...
}
