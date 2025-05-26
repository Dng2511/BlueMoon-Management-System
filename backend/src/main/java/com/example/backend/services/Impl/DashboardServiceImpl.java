package com.example.backend.services.Impl;

import com.example.backend.dtos.DashboardDTO;
import com.example.backend.models.StayStatus;
import com.example.backend.repositories.ApartmentRepository;
import com.example.backend.repositories.ResidentRepository;
import com.example.backend.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {
    private final ResidentRepository residentRepository;
    private final ApartmentRepository apartmentRepository;

    @Override
    public DashboardDTO getDashboard() {
        return new DashboardDTO(
                apartmentRepository.count(),
                residentRepository.count(),
                residentRepository.countByStayStatus(StayStatus.PERMANENT_RESIDENCE),
                residentRepository.countByStayStatus(StayStatus.TEMPORARY_RESIDENCE),
                residentRepository.countByStayStatus(StayStatus.TEMPORARY_ABSENCE),
                residentRepository.countByStayStatus(StayStatus.UNREGISTERED)+residentRepository.countByStayStatusIsNull()
        );
    }
}
