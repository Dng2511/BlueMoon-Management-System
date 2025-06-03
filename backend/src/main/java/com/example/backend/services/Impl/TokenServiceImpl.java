package com.example.backend.services.Impl;

import com.example.backend.services.TokenService;
import com.nimbusds.jose.util.Base64;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.util.Date;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class TokenServiceImpl implements TokenService {

    private RedisTemplate<String, String> redisTemplate;

    static String TOKEN_BLACKLIST_PREFIX = "token:blacklist:";
    static String ACCESS_TOKEN_PREFIX = "token:access:";
    static String REFRESH_TOKEN_PREFIX = "token:refresh:";

    @Override
    public void blacklistToken(String token) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Date now = new Date();

        if (expirationTime.after(now)) {
            long ttlMillis = expirationTime.getTime() - now.getTime();
            long ttlSeconds = ttlMillis / 1000 + 5; // +5s buffer

            log.debug("Token blacklisted with TTL of {} seconds", ttlSeconds);

            String hashedToken = Base64.encode(token).toString();
            redisTemplate.opsForValue().set(
                    TOKEN_BLACKLIST_PREFIX + hashedToken,
                    "revoked",
                    ttlSeconds,
                    TimeUnit.SECONDS
            );
        }
    }

    @Override
    public boolean isTokenBlacklisted(String token) {
        String hashedToken = Base64.encode(token).toString();
        return redisTemplate.hasKey(TOKEN_BLACKLIST_PREFIX + hashedToken);
    }

    @Override
    public void saveAccessToken(String token, String username) throws ParseException{
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Date now = new Date();

        if (expirationTime.after(now)) {
            long ttlMillis = expirationTime.getTime() - now.getTime();
            long ttlSeconds = ttlMillis / 1000;

            redisTemplate.opsForValue().set(
                    ACCESS_TOKEN_PREFIX + token,
                    username,
                    ttlSeconds,
                    TimeUnit.SECONDS
            );
            log.debug("Access token stored for user {} with TTL of {} seconds", username, ttlSeconds);
        }
    }

    @Override
    public void saveRefreshToken(String token, String username) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(token);
        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
        Date now = new Date();

        if (expirationTime.after(now)) {
            long ttlMillis = expirationTime.getTime() - now.getTime();
            long ttlSeconds = ttlMillis / 1000;

            redisTemplate.opsForValue().set(
                    REFRESH_TOKEN_PREFIX + token,
                    username,
                    ttlSeconds,
                    TimeUnit.SECONDS
            );
            log.debug("Refresh token stored for user {} with TTL of {} seconds", username, ttlSeconds);
        }
    }
}