package com.example.backend.controllers;


import com.example.backend.dtos.PaymentDTO;
import com.example.backend.services.PaymentService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping
    public ResponseEntity<Page<PaymentDTO>> getPayments(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit) {
        Pageable pageable = PageRequest.of(page-1, limit);
        return ResponseEntity.ok(paymentService.searchPayments(search, pageable));
    }

    @PostMapping
    public ResponseEntity<PaymentDTO> createPayment(@RequestBody JsonNode data) {
        return ResponseEntity.ok(paymentService.save(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PaymentDTO> updatePayment(@RequestBody JsonNode data, @PathVariable Long id) {
        return ResponseEntity.ok(paymentService.update(data, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.delete(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<Page<PaymentDTO>> searchPayments(
            @RequestParam(value = "queryString", required = false) String search,
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "limit", defaultValue = "20") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit);

        return ResponseEntity.ok(paymentService.searchPayments(search, pageable));
    }
}
