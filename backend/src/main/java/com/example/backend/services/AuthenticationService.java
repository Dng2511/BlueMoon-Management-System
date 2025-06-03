package com.example.backend.services;

import com.example.backend.dtos.AuthenticationDTO;
import com.example.backend.dtos.IntrospectDTO;
import com.nimbusds.jose.JOSEException;

import java.text.ParseException;

public interface AuthenticationService {
    AuthenticationDTO authenticate(AuthenticationDTO authenticationDTO);

    IntrospectDTO introspect(IntrospectDTO introspectDTO) throws JOSEException, ParseException;

    void logout(String token) throws JOSEException, ParseException;

    AuthenticationDTO refreshToken(String refreshToken);
}
