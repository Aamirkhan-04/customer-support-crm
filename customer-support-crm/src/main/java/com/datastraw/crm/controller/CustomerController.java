package com.datastraw.crm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.datastraw.crm.dto.customer.CustomerCreateRequest;
import com.datastraw.crm.dto.customer.CustomerResponse;
import com.datastraw.crm.dto.customer.CustomerUpdateRequest;
import com.datastraw.crm.service.CustomerService;

import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@SecurityRequirement(name = "bearer-key")
@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor
public class CustomerController {

    private final CustomerService customerService;

    @PreAuthorize("hasRole('CUSTOMER')")
    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(
            @Valid @RequestBody CustomerCreateRequest request,
            Authentication authentication) {

        CustomerResponse response =
                customerService.createCustomer(
                        authentication.getName(),
                        request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {

        return ResponseEntity.ok(
                customerService.getAllCustomers());
    }

    @PreAuthorize("hasRole('CUSTOMER')")
    @GetMapping("/me")
    public ResponseEntity<CustomerResponse> getCurrentCustomer(
            Authentication authentication) {

        return ResponseEntity.ok(
                customerService.getCurrentCustomer(
                        authentication.getName()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                customerService.getCustomerById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(
            @PathVariable Long id,
            @Valid @RequestBody CustomerUpdateRequest request) {

        return ResponseEntity.ok(
                customerService.updateCustomer(id, request));
    }
}