package com.example.backend.services;

import com.example.backend.dtos.UserDTO;
import com.example.backend.dtos.subDTO.UserLoginForm;

public interface UserService {
    UserDTO getUserById(Long id);

    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(Long id, UserDTO userDTO);

    void deleteUser(Long id);

    UserDTO loginUser(UserLoginForm userLoginForm);
}
