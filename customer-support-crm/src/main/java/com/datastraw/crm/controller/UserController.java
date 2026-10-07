package com.datastraw.crm.controller;

import java.util.List; 

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.datastraw.crm.dto.userdto.UserManagerRequest;
import com.datastraw.crm.dto.userdto.UserResponse;
import com.datastraw.crm.dto.userdto.UserRoleRequest;
import com.datastraw.crm.dto.userdto.UserStatusRequest;
import com.datastraw.crm.dto.userdto.UserUpdateRequest;
import com.datastraw.crm.service.UserService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearer-key")
@PreAuthorize("hasRole('ADMIN')")
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    // 2. Get All Users
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {

        return ResponseEntity.ok(
                userService.getAllUsers());
    }

    // 3. Get User By ID
    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> getUserById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                userService.getUserById(id));
    }

    // 4. Update User
    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {

        return ResponseEntity.ok(
                userService.updateUser(id, request));
    }

    // 5. Enable / Disable User
    @PatchMapping("/{id}/status")
    public ResponseEntity<UserResponse> updateUserStatus(
            @PathVariable Long id,
            @Valid @RequestBody UserStatusRequest request) {

        return ResponseEntity.ok(
                userService.updateUserStatus(id, request));
    }

    // 6. Change User Role
    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long id,
            @Valid @RequestBody UserRoleRequest request) {

        return ResponseEntity.ok(
                userService.updateUserRole(id, request));
    }
    
    // 7. Assign Manager
    @PatchMapping("/{id}/manager")
    public ResponseEntity<UserResponse> assignManager(@PathVariable Long id,
    		  @Valid @RequestBody UserManagerRequest request){
    	
    	return ResponseEntity.ok(
    			userService.assignManager(id, request));
    }
}