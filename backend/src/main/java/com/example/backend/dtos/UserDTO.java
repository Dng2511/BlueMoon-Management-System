package com.example.backend.dtos;

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
@JsonPropertyOrder({
        "id",
        "username",
        "password",
        "email",
})
public class UserDTO {
    Long id;

    String username;

    String password;

    String email;

    public static UserDTO fromEntity(User user){
      return new UserDTO(
              user.getId(),
              user.getUsername(),
              user.getPassword(),
              user.getEmail()
      );
    }
}
