package com.datastraw.crm.service;

import java.util.List;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.datastraw.crm.dto.userdto.UserCreateRequest;
import com.datastraw.crm.dto.userdto.UserManagerRequest;
import com.datastraw.crm.dto.userdto.UserResponse;
import com.datastraw.crm.dto.userdto.UserRoleRequest;
import com.datastraw.crm.dto.userdto.UserStatusRequest;
import com.datastraw.crm.dto.userdto.UserUpdateRequest;
import com.datastraw.crm.entity.Role;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.exception.InvalidManagerException;
import com.datastraw.crm.exception.UserAlreadyExistsException;
import com.datastraw.crm.exception.UserNotFoundException;
import com.datastraw.crm.repository.RoleRepository;
import com.datastraw.crm.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    // 1. Create User
    public UserResponse createUser(UserCreateRequest request) {

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new UserAlreadyExistsException(
                    "Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new UserAlreadyExistsException(
                    "Email already exists");
        }

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Role not found: " + request.getRole()));

        User user = new User();

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setEnable(true);

        User savedUser = userRepository.save(user);

        return toResponse(savedUser);
    }

    // 2. Get All Users
    public List<UserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 3. Get User By ID
    public UserResponse getUserById(Long id) {

        User user = findUserById(id);

        return toResponse(user);
    }

    // 4. Update User
    public UserResponse updateUser(
            Long id,
            UserUpdateRequest request) {

        User user = findUserById(id);

        if (!user.getUsername().equals(request.getUsername())
                && userRepository.existsByUsername(request.getUsername())) {

            throw new UserAlreadyExistsException(
                    "Username already exists");
        }

        if (!user.getEmail().equals(request.getEmail())
                && userRepository.existsByEmail(request.getEmail())) {

            throw new UserAlreadyExistsException(
                    "Email already exists");
        }

        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(
                passwordEncoder.encode(request.getPassword()));

        User updatedUser = userRepository.save(user);

        return toResponse(updatedUser);
    }

    // 5. Enable / Disable User
    public UserResponse updateUserStatus(
            Long id,
            UserStatusRequest request) {

        User user = findUserById(id);

        user.setEnable(request.isEnable());

        User updatedUser = userRepository.save(user);

        return toResponse(updatedUser);
    }

    // 6. Change User Role
    public UserResponse updateUserRole(
            Long id,
            UserRoleRequest request) {

        User user = findUserById(id);

        Role role = roleRepository.findByName(request.getRole())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Role not found: " + request.getRole()));

        user.setRole(role);

        User updatedUser = userRepository.save(user);

        return toResponse(updatedUser);
    }

    // 7. Assign Manager
    public UserResponse assignManager(Long id,UserManagerRequest request) {
    	User user = findUserById(id);
    	
    	User manager = findUserById(request.getManagerId());
    	
    	if (!manager.getRole().getName().name().equals("MANAGER")) {
			throw new InvalidManagerException("Selected user is not a manager");
		}
    	 if (user.getId().equals(manager.getId())) {
    	        throw new IllegalArgumentException(
    	                "User cannot be their own manager");
    	    }
    	 
    	 user.setManager(manager);
    	 
    	 User updatedUser  = userRepository.save(user);
    	 
    	 return toResponse(updatedUser);
    }
    
    private User findUserById(Long id) {

        return userRepository.findById(id)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found: " + id));
    }

    private UserResponse toResponse(User user) {

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getRole().getName(),
                user.isEnable());
    }
}