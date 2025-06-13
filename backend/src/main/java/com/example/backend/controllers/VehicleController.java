package com.example.backend.controllers;

import com.example.backend.dtos.VehicleDTO;
import com.example.backend.services.VehicleService;
import com.fasterxml.jackson.databind.JsonNode;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/vehicles")
@RequiredArgsConstructor
public class VehicleController {
    private final VehicleService vehicleService;

    @GetMapping
    public ResponseEntity<Page<VehicleDTO>> findAll(@RequestParam(value = "page", defaultValue = "1") int page,
                                                    @RequestParam(value = "limit", defaultValue = "10") int limit) {
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.DESC, "id"));
        return ResponseEntity.ok(vehicleService.getAllVehicles(pageable));
    }

    @PostMapping
    public ResponseEntity<VehicleDTO> create(@RequestBody JsonNode data) {
        return ResponseEntity.ok(vehicleService.createVehicle(data));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> put(@PathVariable("id") Long id, @RequestBody JsonNode data) {
        return ResponseEntity.ok(vehicleService.updateVehicle(data, id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.ok().build();
    }
}
