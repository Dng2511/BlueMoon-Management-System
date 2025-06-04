package com.example.backend.services.Impl;

import com.example.backend.dtos.UserDTO;
import com.example.backend.dtos.subDTO.UserLoginForm;
import com.example.backend.models.User;
import com.example.backend.models.enums.Role;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.UserService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserServiceImpl implements UserService {
    UserRepository userRepository;

    @Override
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional
    public UserDTO createUser(UserDTO userDTO) {
        if (userDTO.getUsername() == null || userDTO.getUsername().isEmpty()) {
            throw new RuntimeException("Username cannot be empty");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
            throw new RuntimeException("Password cannot be empty");
        }
        if (userDTO.getEmail() == null || userDTO.getEmail().isEmpty()) {
            throw new RuntimeException("Email cannot be empty");
        }
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setUsername(userDTO.getUsername());
        user.setPassword(userDTO.getPassword());
        user.setEmail(userDTO.getEmail());
        user.setRole(Role.ADMIN); // Default role

        return UserDTO.fromEntity(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        if (userDTO.getUsername() != null && !userDTO.getUsername().isEmpty()) {
            user.setUsername(userDTO.getUsername());
        } else {
            throw new RuntimeException("Username cannot be empty");
        }
        if (userDTO.getPassword() != null && !userDTO.getPassword().isEmpty()) {
            user.setPassword(userDTO.getPassword());
        } else {
            throw new RuntimeException("Password cannot be empty");
        }
        if (userDTO.getEmail() != null && !userDTO.getEmail().isEmpty()) {
            user.setEmail(userDTO.getEmail());
        } else {
            throw new RuntimeException("Email cannot be empty");
        }

        return UserDTO.fromEntity(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + id));

        userRepository.delete(user);
    }

    @Override
    public UserDTO loginUser(UserLoginForm userLoginForm){
        User user = userRepository.findByEmail(userLoginForm.getEmail())
            .orElseThrow(() -> new RuntimeException("User not found with email: " + userLoginForm.getEmail()));

        if (!user.getPassword().equals(userLoginForm.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return UserDTO.fromEntity(user);
    }
}