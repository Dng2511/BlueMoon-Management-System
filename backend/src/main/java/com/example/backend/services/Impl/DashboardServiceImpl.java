package com.example.backend.services.Impl;

import com.example.backend.dtos.DashboardDTO;
import com.example.backend.dtos.subDTO.PaymentGroupByStatus;
import com.example.backend.dtos.subDTO.ResidentGroupByRelation;
import com.example.backend.dtos.subDTO.ResidentGroupByStayStatus;
import com.example.backend.models.enums.Relation;
import com.example.backend.models.enums.StayStatus;
import com.example.backend.repositories.ApartmentRepository;
import com.example.backend.repositories.FeeRepository;
import com.example.backend.repositories.PaymentRepository;
import com.example.backend.repositories.ResidentRepository;
import com.example.backend.services.DashboardService;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final ResidentRepository residentRepository;
    private final ApartmentRepository apartmentRepository;
    private final PaymentRepository paymentRepository;
    private final FeeRepository feeRepository;

    @Override
    public DashboardDTO getDashboard() {
        LocalDate today = LocalDate.now();
        int year = today.getYear();
        int month = today.getMonthValue();


        ResidentGroupByStayStatus residentGroupByStayStatus = new ResidentGroupByStayStatus(
                residentRepository.countByStayStatus(StayStatus.PERMANENT_RESIDENCE),
                residentRepository.countByStayStatus(StayStatus.TEMPORARY_RESIDENCE),
                residentRepository.countByStayStatus(StayStatus.TEMPORARY_ABSENCE),
                residentRepository.countByStayStatus(StayStatus.UNREGISTERED)
                        +residentRepository.countByStayStatusIsNull()
        );

        ResidentGroupByRelation residentGroupByRelation = new ResidentGroupByRelation(
                residentRepository.countByRelation(Relation.OWNER),
                residentRepository.countByRelation(Relation.TENANT),
                residentRepository.countByRelation(Relation.RELATIVE)
        );

        PaymentGroupByStatus paymentGroupByStatus = new PaymentGroupByStatus(
                paymentRepository.countPaymentByStatus("cash", month, year),
                paymentRepository.countPaymentByStatus("bank transfer", month, year),
                paymentRepository.countPaymentByStatus("credit card", month, year),
                paymentRepository.countPaymentByStatus("not yet paid", month, year),
                paymentRepository.countPaymentByStatus("other", month, year),
                paymentRepository.countNotYetPaidFromPreviousMonth(year, month)


        );



        return new DashboardDTO(
                apartmentRepository.count(),
                residentRepository.count(),
                residentGroupByStayStatus,
                residentGroupByRelation,
                (long) feeRepository.findByMonth(year, month).size(),
                paymentGroupByStatus,
                paymentRepository.getMonthlyRevenueInOneYearRange(month, year, year-1),
                paymentRepository.getAnnualRevenue(year-10, year)
        );
    }
}
