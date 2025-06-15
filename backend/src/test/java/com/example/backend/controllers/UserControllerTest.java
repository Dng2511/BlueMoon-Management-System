package com.example.backend.controllers;

import com.example.backend.dtos.UserDTO;
import com.example.backend.dtos.subDTO.UserLoginForm;
import com.example.backend.models.enums.Role;
import com.example.backend.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockMvc mockMvc = MockMvcBuilders.standaloneSetup(userController).build();
        ObjectMapper objectMapper = new ObjectMapper();
    }

    @Test
    void testGetUserById() {
        Long userId = 1L;
        UserDTO userDTO = createSampleUserDTO(userId, "long", "long@gmail.com");

        when(userService.getUserById(userId)).thenReturn(userDTO);

        ResponseEntity<UserDTO> response = userController.getUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(userId, response.getBody().getId());
        assertEquals("long", response.getBody().getUsername());
        assertEquals("long@gmail.com", response.getBody().getEmail());
        assertEquals(Role.STAFF, response.getBody().getRole());

        verify(userService).getUserById(userId);
    }

    @Test
    void testCreateUser() {
        UserDTO inputUserDTO = new UserDTO();
        inputUserDTO.setUsername("long");
        inputUserDTO.setPassword("password123");
        inputUserDTO.setEmail("long@gmail.com");

        UserDTO createdUserDTO = createSampleUserDTO(1L, "long", "long@gmail.com");

        when(userService.createUser(any(UserDTO.class))).thenReturn(createdUserDTO);

        ResponseEntity<UserDTO> response = userController.createUser(inputUserDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("long", response.getBody().getUsername());
        assertEquals("long@gmail.com", response.getBody().getEmail());
        assertEquals(Role.STAFF, response.getBody().getRole());

        verify(userService).createUser(any(UserDTO.class));
    }

    @Test
    void testUpdateUser() {
        Long userId = 1L;
        UserDTO inputUserDTO = new UserDTO();
        inputUserDTO.setUsername("updated_long");
        inputUserDTO.setPassword("newpassword123");
        inputUserDTO.setEmail("long@gmail.com");

        UserDTO updatedUserDTO = createSampleUserDTO(userId, "updated_long", "long@gmail.com");

        when(userService.updateUser(eq(userId), any(UserDTO.class))).thenReturn(updatedUserDTO);

        ResponseEntity<UserDTO> response = userController.updateUser(userId, inputUserDTO);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(userId, response.getBody().getId());
        assertEquals("updated_long", response.getBody().getUsername());
        assertEquals("long@gmail.com", response.getBody().getEmail());
        assertEquals(Role.STAFF, response.getBody().getRole());

        verify(userService).updateUser(eq(userId), any(UserDTO.class));
    }

    @Test
    void testDeleteUser() {
        Long userId = 1L;
        doNothing().when(userService).deleteUser(userId);

        ResponseEntity<Void> response = userController.deleteUser(userId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        assertNull(response.getBody());

        verify(userService).deleteUser(userId);
    }

    @Test
    void testLoginUser() {
        UserLoginForm loginForm = new UserLoginForm();
        loginForm.setUsername("long");
        loginForm.setPassword("password123");

        UserDTO loggedInUser = createSampleUserDTO(1L, "long", "long@gmail.com");

        when(userService.loginUser(any(UserLoginForm.class))).thenReturn(loggedInUser);

        ResponseEntity<UserDTO> response = userController.loginUser(loginForm);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("long", response.getBody().getUsername());
        assertEquals("long@gmail.com", response.getBody().getEmail());
        assertEquals(Role.STAFF, response.getBody().getRole());

        verify(userService).loginUser(any(UserLoginForm.class));
    }

    @Test
    void testLoginUserWithAdminRole() {
        UserLoginForm loginForm = new UserLoginForm();
        loginForm.setUsername("admin");
        loginForm.setPassword("admin");

        UserDTO adminUser = createSampleUserDTO(1L, "admin", "admin@gmail.com");
        adminUser.setRole(Role.ADMIN);

        when(userService.loginUser(any(UserLoginForm.class))).thenReturn(adminUser);

        ResponseEntity<UserDTO> response = userController.loginUser(loginForm);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1L, response.getBody().getId());
        assertEquals("admin", response.getBody().getUsername());
        assertEquals("admin@gmail.com", response.getBody().getEmail());
        assertEquals(Role.ADMIN, response.getBody().getRole());

        verify(userService).loginUser(any(UserLoginForm.class));
    }


    private UserDTO createSampleUserDTO(Long id, String username, String email) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(id);
        userDTO.setUsername(username);
        userDTO.setPassword("password123");
        userDTO.setEmail(email);
        userDTO.setRole(Role.STAFF);
        return userDTO;
    }
}