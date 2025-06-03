package com.example.backend.services;

import com.example.backend.dtos.PaymentDTO;
import com.example.backend.models.Fee;
import com.example.backend.models.Resident;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    Page<PaymentDTO> findAll(Pageable pageable);

    Page<PaymentDTO> findBy(Long userId, Pageable pageable);

    PaymentDTO save(JsonNode data);

    PaymentDTO update(JsonNode data, Long id);

    void delete(Long id);

    void save(Fee fee, Resident Resident);

    //public Page<PaymentDTO> searchPayments(String feeType, String residentId, String apartmentName, Pageable pageable);

    Page<PaymentDTO> searchPayments(String value, Pageable pageable);
}
