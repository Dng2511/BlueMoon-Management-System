package com.example.backend.controllers;

import com.example.backend.dtos.FeeDTO;
import com.example.backend.dtos.FeePaymentDTO;
import com.example.backend.dtos.PaymentDTO;
import com.example.backend.services.FeeService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class FeeControllerTest {

    @Mock
    private FeeService feeService;

    @InjectMocks
    private FeeController feeController;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testFindAll() {
        FeeDTO fee1 = new FeeDTO(1L, "Electricity", 100000, "2025-06", "Monthly electricity bill", true);
        FeeDTO fee2 = new FeeDTO(2L, "Water", 50000, "2025-06", "Monthly water bill", true);
        List<FeeDTO> fees = Arrays.asList(fee1, fee2);
        Page<FeeDTO> feePage = new PageImpl<>(fees);

        when(feeService.getAllFees(any(Pageable.class))).thenReturn(feePage);

        ResponseEntity<Page<FeeDTO>> response = feeController.findAll(1, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getContent().size());
        assertEquals("Electricity", response.getBody().getContent().get(0).getType());
        assertEquals(100000, response.getBody().getContent().get(0).getAmount());
        verify(feeService, times(1)).getAllFees(any(Pageable.class));
    }

    @Test
    void testFindAllByMonth() {
        Integer year = 2024;
        Integer month = 1;
        FeeDTO fee1 = new FeeDTO(1L, "Electricity", 100000, "2025-06", "Monthly electricity bill", true);
        FeeDTO fee2 = new FeeDTO(2L, "Water", 50000, "2025-06", "Monthly water bill", true);
        List<FeeDTO> fees = Arrays.asList(fee1, fee2);

        when(feeService.getFeesByMonth(year, month)).thenReturn(fees);

        ResponseEntity<List<FeeDTO>> response = feeController.findAllByMonth(year, month);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().size());
        assertEquals("Electricity", response.getBody().get(0).getType());
        assertEquals("2025-06", response.getBody().get(0).getMonth());
        verify(feeService, times(1)).getFeesByMonth(year, month);
    }

    @Test
    void testSave() {
        FeeDTO feeDTO = new FeeDTO(null, "Management", 200000, "2025-07", "Management fee", false);

        ResponseEntity<Void> response = feeController.save(feeDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());
        verify(feeService, times(1)).addFee(feeDTO);
    }

    @Test
    void testUpdate() {
        Long feeId = 1L;
        FeeDTO feeDTO = new FeeDTO(feeId, "Updated Management", 250000, "2025-07", "Updated management fee", true);

        ResponseEntity<Void> response = feeController.update(feeDTO, feeId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());
        verify(feeService, times(1)).updateFee(feeDTO, feeId);
    }

    @Test
    void testDeleteResident() {
        Long feeId = 1L;

        ResponseEntity<Void> response = feeController.deleteResident(feeId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(feeService, times(1)).deleteFee(feeId);
    }

    @Test
    void testGetPayments() {
        Long feeId = 1L;
        PaymentDTO.ResPayment resident = mock(PaymentDTO.ResPayment.class);
        FeePaymentDTO payment1 = new FeePaymentDTO(1L, 1, resident, 100000, "PAID", LocalDate.now());
        FeePaymentDTO payment2 = new FeePaymentDTO(2L, 1, resident, 50000, "UNPAID", null);
        List<FeePaymentDTO> payments = Arrays.asList(payment1, payment2);
        Page<FeePaymentDTO> paymentPage = new PageImpl<>(payments);

        when(feeService.getPayments(any(Pageable.class), eq(feeId))).thenReturn(paymentPage);

        ResponseEntity<?> response = feeController.getPayments(feeId, 1, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertInstanceOf(Page.class, response.getBody());
        Page<FeePaymentDTO> resultPage = (Page<FeePaymentDTO>) response.getBody();
        assertEquals(2, resultPage.getContent().size());
        verify(feeService, times(1)).getPayments(any(Pageable.class), eq(feeId));
    }

    @Test
    void testSearchFees() {
        String type = "Electric";
        FeeDTO fee1 = new FeeDTO(1L, "Electricity", 100000, "2025-06", "Monthly electricity bill", true);
        List<FeeDTO> fees = List.of(fee1);
        Page<FeeDTO> feePage = new PageImpl<>(fees);

        when(feeService.searchFeesByType(eq(type), any(Pageable.class))).thenReturn(feePage);

        ResponseEntity<Page<FeeDTO>> response = feeController.searchFees(type, 1, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());
        assertEquals("Electricity", response.getBody().getContent().get(0).getType());
        verify(feeService, times(1)).searchFeesByType(eq(type), any(Pageable.class));
    }

    @Test
    void testSearchFeesWithNullType() {
        String type = null;
        FeeDTO fee1 = new FeeDTO(1L, "Electricity", 100000, "2025-06", "Monthly electricity bill", true);
        FeeDTO fee2 = new FeeDTO(2L, "Water", 50000, "2025-06", "Monthly water bill", true);
        List<FeeDTO> fees = Arrays.asList(fee1, fee2);
        Page<FeeDTO> feePage = new PageImpl<>(fees);

        when(feeService.searchFeesByType(eq(type), any(Pageable.class))).thenReturn(feePage);

        ResponseEntity<Page<FeeDTO>> response = feeController.searchFees(type, 1, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getContent().size());
        verify(feeService, times(1)).searchFeesByType(eq(type), any(Pageable.class));
    }
}