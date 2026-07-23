package com.aarthi.Resume_Analyser.util;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
@Service
public class JwtService {
    
    private final String SECRET="ResumeAnalyserSecretKeyForJWTAuthentication2026SpringBootProject123456789";
    private final SecretKey KEY=Keys.hmacShaKeyFor(SECRET.getBytes());

    public String generateToken(String email){
        return Jwts.builder()
        .subject(email)
        .issuedAt(new Date())
        .expiration(new Date(System.currentTimeMillis()+1000*60*60))
        .signWith(KEY)
        .compact();

    }

    public String extractEmail(String token){
        return Jwts.parser()
        .verifyWith(KEY)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getSubject();

    }

    public boolean isTokenValid(String token,String email){
        String extractedEmail=extractEmail(token);
        return extractedEmail.equals(email) && !isTokenExpired(token);
    }

    public boolean isTokenExpired(String token){
        Date expiration=Jwts.parser()
        .verifyWith(KEY)
        .build()
        .parseSignedClaims(token)
        .getPayload()
        .getExpiration();
        return expiration.before(new Date());

    }

}
