package com.example.backend.services;

import com.example.backend.dtos.FeeDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeeService {
    public Page<FeeDTO> getAllFees(Pageable pageable);

    public List<FeeDTO> getFeesByMonth(Integer year, Integer month);

    public void addFee(FeeDTO feeDTO);

    public void updateFee(FeeDTO feeDTO, Long id);

    public void deleteFee(Long id);
}
