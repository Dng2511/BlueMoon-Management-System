package com.example.backend.dtos.subDTO;

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
        "username",
        "password",
})
public class UserLoginForm {
    String username;

    String password;

//    public static UserLoginForm fromEmailAndPassword(String email, String password) {
//        return new UserLoginForm(email, password);
//    }
}
