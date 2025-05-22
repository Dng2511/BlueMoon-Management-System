package com.example.backend.services.Impl;

import com.example.backend.dtos.ApartmentDTO;
import com.example.backend.dtos.PaymentDTO;
import com.example.backend.models.Fee;
import com.example.backend.models.Payment;
import com.example.backend.models.Resident;
import com.example.backend.repositories.FeeRepository;
import com.example.backend.repositories.PaymentRepository;
import com.example.backend.repositories.ResidentRepository;
import com.example.backend.services.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {
    private final PaymentRepository paymentRepository;
    private final ResidentRepository residentRepository;
    private final FeeRepository feeRepository;

    @Override
    public Page<PaymentDTO> findAll(Pageable pageable) {
        return paymentRepository.findAll(pageable).map(PaymentDTO::fromEntity);
    }

    @Override
    public Page<PaymentDTO> findBy(Long userId, Pageable pageable) {
        return null;
    }

    @Override
    public PaymentDTO save(JsonNode data) {
        Resident resident = residentRepository.findById(data.get("resident_id").asLong())
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        if (!Objects.equals(resident.getRelation().name(),"owner") &&
                !Objects.equals(resident.getRelation().name(),"tenant")) {

            throw new IllegalArgumentException("Resident "+ resident.getId()+ " " + resident.getFullName() + " has invalid relation: " + resident.getRelation());
        }
        Fee fee = feeRepository.findById(data.get("fee_id").asLong())
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        Payment payment = new Payment();
        payment.setResident(resident);
        payment.setFee(fee);
        Integer quantity = 1;
        if (Objects.equals(fee.getType(), "area")) {
            quantity = resident.getApartment().getArea();
        }
        payment.setQuantity(quantity);
        payment.setAmountPaid(fee.getAmount()*quantity);

        String method = data.hasNonNull("payment_method") ? data.get("payment_method").asText() : null;

        if (method == null || method.trim().isEmpty()) {
            payment.setPaymentMethod("not yet paid");
            payment.setDatePaid(null); // ngày mặc định
        } else {
            payment.setPaymentMethod(method);
            payment.setDatePaid(LocalDate.now()); // hoặc bạn lấy từ dữ liệu nếu có
        }
        return PaymentDTO.fromEntity(paymentRepository.save(payment));
    }

    @Override
    public PaymentDTO update(JsonNode data, Long id) {
        Resident resident = residentRepository.findById(data.get("resident_id").asLong())
                .orElseThrow(() -> new RuntimeException("Resident not found"));
        if (!Objects.equals(resident.getRelation().name(),"owner") &&
                !Objects.equals(resident.getRelation().name(),"tenant")) {

            throw new IllegalArgumentException("Resident "+ resident.getId()+ " " + resident.getFullName() + " has invalid relation: " + resident.getRelation());
        }
        Fee fee = feeRepository.findById(data.get("fee_id").asLong())
                .orElseThrow(() -> new RuntimeException("Fee not found"));

        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setResident(resident);
        payment.setFee(fee);
        Integer quantity = 1;
        if (Objects.equals(fee.getType(), "area")) {
            quantity = resident.getApartment().getArea();
        }
        payment.setQuantity(quantity);
        payment.setAmountPaid(fee.getAmount()*quantity);

        String method = data.hasNonNull("payment_method") ? data.get("payment_method").asText() : null;

        if (method == null || method.trim().isEmpty()) {
            payment.setPaymentMethod("not yet paid");
            payment.setDatePaid(null); // ngày mặc định
        } else {
            payment.setPaymentMethod(method);
            if (payment.getDatePaid() != null) payment.setDatePaid(LocalDate.now());
        }
        return PaymentDTO.fromEntity(paymentRepository.save(payment));
    }

    @Override
    public void delete(Long id) {
        paymentRepository.deleteById(id);
    }


    @Override
    public void save(Fee fee, Resident resident) {
        Payment payment = new Payment();
        Integer quantity = 1;
        if (Objects.equals(fee.getType(), "area")) {
            quantity = resident.getApartment().getArea();
        }
        payment.setQuantity(quantity);
        payment.setAmountPaid(fee.getAmount()*quantity);
        payment.setPaymentMethod("not yet paid");
        payment.setDatePaid(null);

        paymentRepository.save(payment);
    }



}
