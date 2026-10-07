package com.datastraw.crm.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.datastraw.crm.dto.loginregisterdto.AuthResponse;
import com.datastraw.crm.dto.loginregisterdto.LoginRequest;
import com.datastraw.crm.dto.loginregisterdto.RegisterRequest;
import com.datastraw.crm.dto.userdto.UserCreateRequest;
import com.datastraw.crm.dto.userdto.UserResponse;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.enums.RoleName;
import com.datastraw.crm.exception.UserNotFoundException;
import com.datastraw.crm.repository.UserRepository;
import com.datastraw.crm.security.JwtService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserService userService;

    // 1. Login
    public AuthResponse login(LoginRequest loginRequest) {

        Authentication authentication =
                authenticationManager.authenticate(
                        new UsernamePasswordAuthenticationToken(
                                loginRequest.getEmail(),
                                loginRequest.getPassword()));

        User user = findUserByEmail(authentication.getName());

        String token = jwtService.generateToken(user);

        return new AuthResponse(
                token,
                user.getEmail(),
                user.getRole().getName());
    }

    // 2. Register
    public void register(RegisterRequest registerRequest) {

        UserCreateRequest request = new UserCreateRequest();

        request.setUsername(registerRequest.getUsername());
        request.setEmail(registerRequest.getEmail());
        request.setPassword(registerRequest.getPassword());
        request.setRole(RoleName.CUSTOMER);

        userService.createUser(request);
    }

    // 3. Current User
    public UserResponse getCurrentUser(String email) {

        User user = findUserByEmail(email);

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName(),
                user.isEnable());
    }

    private User findUserByEmail(String email) {

        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found"));
    }
}