package com.example.backend.services.Impl;

import com.example.backend.dtos.FeeDTO;
import com.example.backend.dtos.FeePaymentDTO;
import com.example.backend.models.Fee;
import com.example.backend.models.Payment;
import com.example.backend.models.Resident;
import com.example.backend.repositories.FeeRepository;
import com.example.backend.repositories.PaymentRepository;
import com.example.backend.repositories.ResidentRepository;
import com.example.backend.services.FeeService;
import com.example.backend.services.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FeeServiceImpl implements FeeService {
    private final FeeRepository feeRepository;
    private final ResidentRepository residentRepository;
    private final PaymentService paymentService;
    private final PaymentRepository paymentRepository;

    @Override
    public Page<FeeDTO> getAllFees(Pageable pageable) {
        return feeRepository.findAll(pageable).map(FeeDTO::fromEntity);
    }

    @Override
    public Page<FeePaymentDTO> getPayments(Pageable pageable, Long id) {
        return paymentRepository.findByFeeId(pageable, id).map(FeePaymentDTO::fromEntity);
    }

    @Override
    public List<FeeDTO> getFeesByMonth(Integer year, Integer month) {
        return feeRepository.findByMonth(year, month).stream().map(FeeDTO::fromEntity).collect(Collectors.toList());
    }

    @Override
    public void addFee(FeeDTO feeDTO) {
        String input = feeDTO.getMonth();
        String[] parts = input.split("-");
        Integer year = Integer.parseInt(parts[0]);
        Integer month = Integer.parseInt(parts[1]);

        Fee f = new Fee();
        f.setAmount(feeDTO.getAmount());
        f.setType(feeDTO.getType());
        f.setDescription(feeDTO.getDescription());
        f.setYear(year);
        f.setMonth(month);
        f.setCompulsory(feeDTO.isCompulsory());
        feeRepository.save(f);
        if(feeDTO.isCompulsory()) {
            List<Resident> residents = residentRepository.findByRelationIn(List.of("OWNER"));
            for (Resident resident : residents) {
                paymentService.save(f, resident);
            }
        }

    }

    @Override
    public void updateFee(FeeDTO feeDTO, Long id) {
        String input = feeDTO.getMonth();
        String[] parts = input.split("-");
        Integer year = Integer.parseInt(parts[0]);
        Integer month = Integer.parseInt(parts[1]);

        Fee f = feeRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Fee not found")
        );
        f.setAmount(feeDTO.getAmount());
        List<Payment> payments = paymentRepository.findByFeeId(id);
        for (Payment payment : payments) {
            payment.setAmountPaid(feeDTO.getAmount()*payment.getQuantity());
            paymentRepository.save(payment);
        }
        f.setType(feeDTO.getType());
        f.setDescription(feeDTO.getDescription());
        f.setYear(year);
        f.setMonth(month);
        f.setCompulsory(feeDTO.isCompulsory());
        feeRepository.save(f);
    }

    @Override
    public void deleteFee(Long id) {
        feeRepository.deleteById(id);
    }

    @Override
    public Page<FeeDTO> searchFeesByType(String type, Pageable pageable) {
        return feeRepository.findByTypeContaining(type, pageable).map(FeeDTO::fromEntity);
    }
}
