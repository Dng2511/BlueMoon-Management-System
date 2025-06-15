package com.example.backend.controllers;

import com.example.backend.dtos.ApartmentDTO;
import com.example.backend.dtos.subDTO.ApartmentDetailDTO;
import com.example.backend.dtos.subDTO.ApartmentSummaryDTO;
import com.example.backend.services.ApartmentService;
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
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApartmentControllerTest {

    @Mock
    private ApartmentService apartmentService;

    @InjectMocks
    private ApartmentController apartmentController;

    private MockMvc mockMvc;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(apartmentController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testFindAll() {
        ApartmentSummaryDTO apartment1 = new ApartmentSummaryDTO(1L, "Apartment 1", 100, 2, LocalDate.now());
        ApartmentSummaryDTO apartment2 = new ApartmentSummaryDTO(2L, "Apartment 2", 120, 3, LocalDate.now());
        List<ApartmentSummaryDTO> apartments = Arrays.asList(apartment1, apartment2);
        Page<ApartmentSummaryDTO> apartmentPage = new PageImpl<>(apartments);

        when(apartmentService.getAllApartments(any(Pageable.class))).thenReturn(apartmentPage);

        ResponseEntity<Page<ApartmentSummaryDTO>> response = apartmentController.findAll(1, 20);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getContent().size());
        assertEquals("Apartment 1", response.getBody().getContent().get(0).getName());
        verify(apartmentService, times(1)).getAllApartments(any(Pageable.class));
    }

    @Test
    void testSaveApartment() throws Exception {
        String jsonData = "{\"name\":\"New Apartment\",\"area\":150}";
        JsonNode data = objectMapper.readTree(jsonData);
        ApartmentDTO savedApartment = new ApartmentDTO(1L, "New Apartment", 150);

        when(apartmentService.saveApartment(any(JsonNode.class))).thenReturn(savedApartment);

        ResponseEntity<ApartmentDTO> response = apartmentController.saveApartment(data);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("New Apartment", response.getBody().getName());
        assertEquals(150, response.getBody().getArea());
        verify(apartmentService, times(1)).saveApartment(any(JsonNode.class));
    }

    @Test
    void testUpdateApartment() throws Exception {
        Long apartmentId = 1L;
        String jsonData = "{\"name\":\"Updated Apartment\",\"area\":180}";
        JsonNode data = objectMapper.readTree(jsonData);
        ApartmentDTO updatedApartment = new ApartmentDTO(apartmentId, "Updated Apartment", 180);

        when(apartmentService.updateApartment(any(JsonNode.class), eq(apartmentId))).thenReturn(updatedApartment);

        ResponseEntity<ApartmentDTO> response = apartmentController.updateApartment(apartmentId, data);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Updated Apartment", response.getBody().getName());
        assertEquals(180, response.getBody().getArea());
        verify(apartmentService, times(1)).updateApartment(any(JsonNode.class), eq(apartmentId));
    }

    @Test
    void testDeleteApartment() {
        Long apartmentId = 1L;

        ResponseEntity<Void> response = apartmentController.deleteApartment(apartmentId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());
        verify(apartmentService, times(1)).deleteApartment(apartmentId);
    }

    @Test
    void testGetApartmentDetail() {
        Long apartmentId = 1L;
        ApartmentDetailDTO apartmentDetail = new ApartmentDetailDTO(
                apartmentId,
                "Apartment123",
                200,
                4,
                LocalDate.now(),
                Arrays.asList()
        );

        when(apartmentService.getApartmentDetail(apartmentId)).thenReturn(apartmentDetail);

        ResponseEntity<ApartmentDetailDTO> response = apartmentController.getApartmentDetail(apartmentId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Apartment123", response.getBody().getName());
        assertEquals(200, response.getBody().getArea());
        assertEquals(4, response.getBody().getResidentCount());
        verify(apartmentService, times(1)).getApartmentDetail(apartmentId);
    }
}