package com.example.backend.services;

import java.text.ParseException;

public interface TokenService {
    void blacklistToken(String token) throws ParseException;

    boolean isTokenBlacklisted(String token);

    // lưu access token kèm username
    void saveAccessToken(String token, String username) throws ParseException;

    // lưu refresh token kèm username
    void saveRefreshToken(String token, String username) throws ParseException;
}
