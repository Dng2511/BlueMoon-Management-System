package com.example.backend.controllers;

import com.example.backend.dtos.PaymentDTO;
import com.example.backend.services.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private PaymentService paymentService;

    @InjectMocks
    private PaymentController paymentController;

    private ObjectMapper objectMapper;
    private PaymentDTO samplePaymentDTO;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();

        samplePaymentDTO = new PaymentDTO();
        samplePaymentDTO.setId(1L);
        samplePaymentDTO.setQuantity(1);
        samplePaymentDTO.setAmountPaid(1000000);
        samplePaymentDTO.setStatus("paid");
        samplePaymentDTO.setDatePaid(LocalDate.now());
    }

    @Test
    void testGetPayments() {
        List<PaymentDTO> payments = Collections.singletonList(samplePaymentDTO);
        Page<PaymentDTO> paymentsPage = new PageImpl<>(payments);

        when(paymentService.searchPayments(any(), any(Pageable.class)))
                .thenReturn(paymentsPage);

        ResponseEntity<Page<PaymentDTO>> result = paymentController.getPayments(null, 1, 20);

        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getContent().size());
        verify(paymentService).searchPayments(eq(null), any(Pageable.class));
    }

    @Test
    void testCreatePayment() throws Exception {
        String jsonData = "{\"resident_id\": 1, \"fee_id\": 1, \"quantity\": 2}";
        JsonNode data = objectMapper.readTree(jsonData);

        when(paymentService.save(any(JsonNode.class))).thenReturn(samplePaymentDTO);

        ResponseEntity<PaymentDTO> result = paymentController.createPayment(data);

        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertEquals(samplePaymentDTO, result.getBody());
        verify(paymentService).save(data);
    }

    @Test
    void testUpdatePayment() throws Exception {
        Long paymentId = 1L;
        String jsonData = "{\"resident_id\": 1, \"fee_id\": 1, \"quantity\": 3}";
        JsonNode data = objectMapper.readTree(jsonData);

        when(paymentService.update(any(JsonNode.class), eq(paymentId)))
                .thenReturn(samplePaymentDTO);

        ResponseEntity<PaymentDTO> result = paymentController.updatePayment(data, paymentId);

        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertEquals(samplePaymentDTO, result.getBody());
        verify(paymentService).update(data, paymentId);
    }

    @Test
    void testDeletePayment() {
        Long paymentId = 1L;
        doNothing().when(paymentService).delete(paymentId);

        ResponseEntity<Void> result = paymentController.deletePayment(paymentId);

        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        verify(paymentService).delete(paymentId);
    }

    @Test
    void testSearchPayments() {
        String searchValue = "nig";
        List<PaymentDTO> payments = Collections.singletonList(samplePaymentDTO);
        Page<PaymentDTO> paymentsPage = new PageImpl<>(payments);

        when(paymentService.searchPayments(eq(searchValue), any(Pageable.class)))
                .thenReturn(paymentsPage);

        ResponseEntity<Page<PaymentDTO>> result = paymentController.searchPayments(searchValue, 1, 20);

        assertNotNull(result);
        assertEquals(200, result.getStatusCodeValue());
        assertNotNull(result.getBody());
        assertEquals(1, result.getBody().getContent().size());
        verify(paymentService).searchPayments(eq(searchValue), any(Pageable.class));
    }
}