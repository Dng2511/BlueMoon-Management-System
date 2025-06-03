package com.example.backend.services.Impl;

import com.example.backend.dtos.AuthenticationDTO;
import com.example.backend.dtos.IntrospectDTO;
import com.example.backend.models.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.services.AuthenticationService;
import com.example.backend.services.TokenService;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationServiceImpl implements AuthenticationService {
    UserRepository userRepository;
    TokenService tokenService;

    @NonFinal
    @Value("${jwt.secret}")
    private String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.expiration}")
    private long jwtExpiration;

    //Set<String> blacklist = ConcurrentHashMap.newKeySet();

    // Hàm đưa token vào blacklist
//    public void blacklistToken(String token) {
//        blacklist.add(token);
//    }

    // Hàm kiểm tra token có bị blacklist không
//    public boolean isTokenBlacklisted(String token) {
//        return blacklist.contains(token);
//    }

    @Override
    public AuthenticationDTO authenticate(AuthenticationDTO authenticationDTO) {
        var user = userRepository.findByUsername(authenticationDTO.getUsername()).orElseThrow(() -> new RuntimeException("User not found"));

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(10);

        boolean authenticated = passwordEncoder.matches(authenticationDTO.getPassword(), user.getPassword());

        if (!authenticated) throw new RuntimeException("Wrong Password!"); // Nhap sai mat khau

        var token = generateToken(user);
        var refreshToken = generateRefreshToken(user);

        try {
            // lưu token và refreshToken vào redis để theo dõi
            tokenService.saveAccessToken(token, user.getUsername());
            tokenService.saveRefreshToken(refreshToken, user.getUsername());
        } catch (Exception e) {
            log.error("Error saving tokens to Redis", e);
        }

        return AuthenticationDTO.builder().
                username(authenticationDTO.getUsername()).
                token(token).
                refreshToken(refreshToken).
                authenticated(true).
                build();
    }

    @Override
    public IntrospectDTO introspect(IntrospectDTO introspectDTO) throws JOSEException, ParseException {
        var token = introspectDTO.getToken();

        // Kiểm tra token có trong blacklist không
        if (tokenService.isTokenBlacklisted(token)) return IntrospectDTO.builder().valid(false).build();

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        var verified = signedJWT.verify(verifier);

        return IntrospectDTO.builder().valid(verified && expirationTime.after(new Date())).build();
    }

    private String generateToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512); // Lay token voi thuat toan HMAC-SHA512

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder().
                subject(user.getUsername()).
                issuer("chu nig").
                issueTime(new Date()).
                expirationTime(new Date(Instant.now().plusMillis(jwtExpiration).toEpochMilli())). // thoi diem hien tai + tgian het han
                        jwtID(UUID.randomUUID().toString()).
                claim("scope", user.getRoles()).
                build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Error generating token", e);
            throw new RuntimeException(e);
        }
    }

    private String generateRefreshToken(User user) {
        JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(user.getUsername())
                .issuer("chu nig")
                .issueTime(new Date())
                .expirationTime(new Date(Instant.now().plusMillis(7 * 24 * 60 * 60 * 1000L).toEpochMilli())) // 7 days
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", "REFRESH_TOKEN")
                .build();

        Payload payload = new Payload(jwtClaimsSet.toJSONObject());
        JWSObject jwsObject = new JWSObject(header, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Error generating refresh token", e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public AuthenticationDTO refreshToken(String refreshToken) {
        try {
            SignedJWT signedJWT = SignedJWT.parse(refreshToken);
            JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
            if (!signedJWT.verify(verifier)) {
                throw new RuntimeException("Invalid refresh token");
            }

            Date expirationTime = signedJWT.getJWTClaimsSet().getExpirationTime();
            if (expirationTime.before(new Date())) {
                throw new RuntimeException("Refresh token is expired");
            }

            // Kiểm tra thêm scope nếu sinh refresh token có claim riêng
            String scope = (String) signedJWT.getJWTClaimsSet().getClaim("scope");
            if (scope == null || !"REFRESH_TOKEN".equals(scope)) {
                throw new RuntimeException("Invalid refresh token scope");
            }

            String username = signedJWT.getJWTClaimsSet().getSubject();
            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String newAccessToken = generateToken(user);

            // Sinh refresh token mới
            //String newRefreshToken = generateRefreshToken(user); // d can thiet lam bo di

            return AuthenticationDTO.builder()
                    .username(username)
                    .token(newAccessToken)
                    .authenticated(true)
                    //.refreshToken(newRefreshToken)
                    .build();

        } catch (ParseException | JOSEException e) {
            throw new RuntimeException("Invalid refresh token", e);
        }
    }

    @Override
    public void logout(String token) throws JOSEException, ParseException {
        if (token == null || token.isBlank()) throw new RuntimeException("Token is missing");
        if (tokenService.isTokenBlacklisted(token)) throw new RuntimeException("Token is already blacklisted");

        tokenService.blacklistToken(token);
    }
}