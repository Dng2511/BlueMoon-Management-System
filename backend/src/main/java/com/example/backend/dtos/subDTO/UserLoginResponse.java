package com.example.backend.dtos.subDTO;

import com.example.backend.models.User;
import com.example.backend.models.enums.Role;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserLoginResponse {

    Role role;

    public static UserLoginResponse fromEntity(User user) {
        return new UserLoginResponse(
                user.getRole()
        );
    }
}
