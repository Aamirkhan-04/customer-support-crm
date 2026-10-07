package com.datastraw.crm.security;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.datastraw.crm.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private final SecretKey secretKey;
	private final long expirationTime;
	
	public JwtService(
			@Value("${app.jwt.secret}") String secret, 
			@Value("${app.jwt.expiration}")long expirationTime) {
		
		this.secretKey=Keys.hmacShaKeyFor(
				  Decoders.BASE64.decode(secret)
				);
		this.expirationTime=expirationTime;
	}
	
	public String generateToken(User user) {
		
		Date issueAt=new Date();
		Date expiration=new Date(issueAt.getTime()+expirationTime);
		
		return Jwts.builder()
				.subject(user.getEmail())
				.claim("role", user.getRole().getName().name())
				.issuedAt(issueAt)
				.expiration(expiration)
				.signWith(secretKey)
				.compact();
	}
	
	public String extractEmail(String token) {
		
		return getClaims(token).getSubject();
	}
	
	public Claims getClaims(String token) {
		
		return Jwts.parser()
				.verifyWith(secretKey)
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
}
