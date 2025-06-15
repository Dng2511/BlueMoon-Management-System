package com.example.backend.controllers;

import com.example.backend.dtos.VehicleDTO;
import com.example.backend.services.VehicleService;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleControllerTest {

    @Mock
    private VehicleService vehicleService;

    @InjectMocks
    private VehicleController vehicleController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(vehicleController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testFindAll() {
        VehicleDTO vehicle1 = new VehicleDTO();
        vehicle1.setLicense("29A-12345");
        vehicle1.setType("CAR");
        vehicle1.setApartment("A101");

        VehicleDTO vehicle2 = new VehicleDTO();
        vehicle2.setLicense("29B-67890");
        vehicle2.setType("MOTORBIKE");
        vehicle2.setApartment("B202");

        List<VehicleDTO> vehicles = Arrays.asList(vehicle1, vehicle2);
        Page<VehicleDTO> vehiclePage = new PageImpl<>(vehicles, PageRequest.of(0, 10), 2);

        Pageable expectedPageable = PageRequest.of(0, 10, Sort.by(Sort.Direction.DESC, "id"));
        when(vehicleService.getAllVehicles(expectedPageable)).thenReturn(vehiclePage);

        ResponseEntity<Page<VehicleDTO>> response = vehicleController.findAll(1, 10);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getContent().size());
        assertEquals("29A-12345", response.getBody().getContent().get(0).getLicense());
        assertEquals("29B-67890", response.getBody().getContent().get(1).getLicense());

        verify(vehicleService, times(1)).getAllVehicles(expectedPageable);
    }

    @Test
    void testCreate() throws Exception {
        String requestJson = """
            {
                "license": "29C-99999",
                "type": "CAR",
                "apartmentId": 1
            }
            """;

        JsonNode requestData = objectMapper.readTree(requestJson);

        VehicleDTO expectedVehicle = new VehicleDTO();
        expectedVehicle.setLicense("29C-99999");
        expectedVehicle.setType("CAR");
        expectedVehicle.setApartment("A101");

        when(vehicleService.createVehicle(any(JsonNode.class))).thenReturn(expectedVehicle);

        ResponseEntity<VehicleDTO> response = vehicleController.create(requestData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("29C-99999", response.getBody().getLicense());
        assertEquals("CAR", response.getBody().getType());
        assertEquals("A101", response.getBody().getApartment());

        verify(vehicleService, times(1)).createVehicle(any(JsonNode.class));
    }

    @Test
    void testUpdate() throws Exception {
        Long vehicleId = 1L;
        String requestJson = """
            {
                "license": "29D-88888",
                "type": "MOTORBIKE",
                "apartmentId": 2
            }
            """;

        JsonNode requestData = objectMapper.readTree(requestJson);

        VehicleDTO updatedVehicle = new VehicleDTO();
        updatedVehicle.setLicense("29D-88888");
        updatedVehicle.setType("MOTORBIKE");
        updatedVehicle.setApartment("B202");

        when(vehicleService.updateVehicle(any(JsonNode.class), eq(vehicleId))).thenReturn(updatedVehicle);

        ResponseEntity<VehicleDTO> response = vehicleController.put(vehicleId, requestData);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("29D-88888", response.getBody().getLicense());
        assertEquals("MOTORBIKE", response.getBody().getType());
        assertEquals("B202", response.getBody().getApartment());

        verify(vehicleService, times(1)).updateVehicle(any(JsonNode.class), eq(vehicleId));
    }

    @Test
    void testDelete() {
        Long vehicleId = 1L;
        doNothing().when(vehicleService).deleteVehicle(vehicleId);

        ResponseEntity<Void> response = vehicleController.delete(vehicleId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNull(response.getBody());

        verify(vehicleService, times(1)).deleteVehicle(vehicleId);
    }
}