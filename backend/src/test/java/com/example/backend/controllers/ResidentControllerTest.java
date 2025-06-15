package com.example.backend.controllers;

import com.example.backend.dtos.ResidentDTO;
import com.example.backend.services.ResidentService;
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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResidentControllerTest {

    @Mock
    private ResidentService residentService;

    @InjectMocks
    private ResidentController residentController;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(residentController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testGetAll() {
        ResidentDTO resident1 = createSampleResidentDTO(1L, "nig");
        ResidentDTO resident2 = createSampleResidentDTO(2L, "lng");
        List<ResidentDTO> residents = Arrays.asList(resident1, resident2);
        Page<ResidentDTO> page = new PageImpl<>(residents);

        Pageable expectedPageable = PageRequest.of(0, 20, Sort.by(Sort.Direction.DESC, "id"));
        when(residentService.getAllResidents(eq(expectedPageable), isNull(), isNull()))
                .thenReturn(page);

        ResponseEntity<Page<ResidentDTO>> response = residentController.getAll(1, 20, null, null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(2, response.getBody().getContent().size());
        assertEquals("nig", response.getBody().getContent().get(0).getFullName());
        assertEquals("lng", response.getBody().getContent().get(1).getFullName());

        verify(residentService).getAllResidents(eq(expectedPageable), isNull(), isNull());
    }

    @Test
    void testGetAllWithSearchAndGender() {
        ResidentDTO resident = createSampleResidentDTO(1L, "nig");
        List<ResidentDTO> residents = List.of(resident);
        Page<ResidentDTO> page = new PageImpl<>(residents);

        Pageable expectedPageable = PageRequest.of(1, 10, Sort.by(Sort.Direction.DESC, "id"));
        when(residentService.getAllResidents(eq(expectedPageable), eq("Pham"), eq("MALE")))
                .thenReturn(page);

        ResponseEntity<Page<ResidentDTO>> response = residentController.getAll(2, 10, "Pham", "MALE");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().getContent().size());

        verify(residentService).getAllResidents(eq(expectedPageable), eq("Pham"), eq("MALE"));
    }

    @Test
    void testSaveResident() throws Exception {
        ResidentDTO savedResident = createSampleResidentDTO(1L, "nig");

        String jsonData = """
            {
                "fullName": "nig",
                "cccd": "123456789",
                "dob": "1990-01-01",
                "gender": "MALE",
                "occupation": "Engineer",
                "phoneNumber": "0987654321",
                "relation": "OWNER",
                "stay_status": "REGISTERED",
                "apartmentId": 1
            }
            """;

        JsonNode jsonNode = objectMapper.readTree(jsonData);
        when(residentService.saveResident(any(JsonNode.class))).thenReturn(savedResident);

        ResponseEntity<ResidentDTO> response = residentController.saveResident(jsonNode);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("nig", response.getBody().getFullName());
        assertEquals(1L, response.getBody().getId());

        verify(residentService).saveResident(any(JsonNode.class));
    }

    @Test
    void testUpdateResidentWithImage() {
        Long residentId = 1L;
        ResidentDTO updatedResident = createSampleResidentDTO(residentId, "nig Updated");
        MockMultipartFile imageFile = new MockMultipartFile(
                "imageFile",
                "avatar.jpg",
                MediaType.IMAGE_JPEG_VALUE,
                "image content".getBytes()
        );

        when(residentService.updateResident(eq(residentId), any(MultipartFile.class)))
                .thenReturn(updatedResident);

        ResponseEntity<ResidentDTO> response = residentController.updateResident(residentId, imageFile);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("nig Updated", response.getBody().getFullName());
        assertEquals(residentId, response.getBody().getId());

        verify(residentService).updateResident(eq(residentId), any(MultipartFile.class));
    }

    @Test
    void testUpdateResidentWithData() throws Exception {
        Long residentId = 1L;
        ResidentDTO updatedResident = createSampleResidentDTO(residentId, "nig Updated");

        String jsonData = """
            {
                "fullName": "nig Updated",
                "cccd": "123456789",
                "dob": "1990-01-01",
                "gender": "MALE",
                "occupation": "Senior Engineer",
                "phoneNumber": "0987654321",
                "relation": "OWNER",
                "stay_status": "REGISTERED",
                "apartmentId": 1
            }
            """;

        JsonNode jsonNode = objectMapper.readTree(jsonData);
        when(residentService.updateResident(any(JsonNode.class), eq(residentId)))
                .thenReturn(updatedResident);

        ResponseEntity<ResidentDTO> response = residentController.updateResident(jsonNode, residentId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("nig Updated", response.getBody().getFullName());
        assertEquals(residentId, response.getBody().getId());

        verify(residentService).updateResident(any(JsonNode.class), eq(residentId));
    }

    @Test
    void testDeleteResident() {
        Long residentId = 1L;
        doNothing().when(residentService).deleteResident(residentId);

        ResponseEntity<Void> response = residentController.deleteResident(residentId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());

        verify(residentService).deleteResident(residentId);
    }

    private ResidentDTO createSampleResidentDTO(Long id, String fullName) {
        ResidentDTO resident = new ResidentDTO();
        resident.setId(id);
        resident.setFullName(fullName);
        resident.setCccd("123456789");
        resident.setDob(LocalDate.of(1990, 1, 1));
        resident.setGender("MALE");
        resident.setOccupation("Engineer");
        resident.setPhoneNumber("0987654321");
        resident.setAvatar("default.jpg");
        resident.setStayStatus("REGISTERED");
        resident.setRelation("OWNER");
        return resident;
    }
}