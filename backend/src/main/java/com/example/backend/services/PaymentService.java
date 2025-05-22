package com.example.backend.services;

import com.example.backend.dtos.PaymentDTO;
import com.example.backend.models.Fee;
import com.example.backend.models.Resident;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PaymentService {
    public Page<PaymentDTO> findAll(Pageable pageable);

    public Page<PaymentDTO> findByUserId(Long userId, Pageable pageable);

    public PaymentDTO save(JsonNode data, Long id);

    public PaymentDTO update(JsonNode data, Long id);

    void save(Fee fee, Resident Resident);
}
