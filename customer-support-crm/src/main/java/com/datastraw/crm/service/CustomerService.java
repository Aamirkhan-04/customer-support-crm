package com.datastraw.crm.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.datastraw.crm.dto.customer.CustomerCreateRequest;
import com.datastraw.crm.dto.customer.CustomerResponse;
import com.datastraw.crm.dto.customer.CustomerUpdateRequest;
import com.datastraw.crm.entity.Customer;
import com.datastraw.crm.entity.User;
import com.datastraw.crm.exception.CustomerAlreadyExistsException;
import com.datastraw.crm.exception.CustomerNotFoundException;
import com.datastraw.crm.exception.UserNotFoundException;
import com.datastraw.crm.repository.CustomerRepository;
import com.datastraw.crm.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final UserRepository userRepository;

    // 1. Create Customer
    public CustomerResponse createCustomer(
            String email,
            CustomerCreateRequest request) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new UserNotFoundException(
                                "User not found: " + email));

        if (customerRepository.findByUser_Email(email).isPresent()) {
            throw new CustomerAlreadyExistsException(
                    "Customer profile already exists");
        }

        Customer customer = new Customer();

        customer.setUser(user);
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        Customer savedCustomer = customerRepository.save(customer);

        return toResponse(savedCustomer);
    }

    // 2. Get All Customers
    public List<CustomerResponse> getAllCustomers() {

        return customerRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // 3. Get Customer By ID
    public CustomerResponse getCustomerById(Long id) {

        Customer customer = findCustomerById(id);

        return toResponse(customer);
    }

    // 4. Get Current Customer
    public CustomerResponse getCurrentCustomer(String email) {

        Customer customer = customerRepository
                .findByUser_Email(email)
                .orElseThrow(() ->
                        new CustomerNotFoundException(
                                "Customer profile not found: " + email));

        return toResponse(customer);
    }

    // 5. Update Customer
    public CustomerResponse updateCustomer(
            Long id,
            CustomerUpdateRequest request) {

        Customer customer = findCustomerById(id);

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhone(request.getPhone());
        customer.setAddress(request.getAddress());

        Customer updatedCustomer =
                customerRepository.save(customer);

        return toResponse(updatedCustomer);
    }

    // Common method for repeated customer lookup
    private Customer findCustomerById(Long id) {

        return customerRepository.findById(id)
                .orElseThrow(() ->
                        new CustomerNotFoundException(
                                "Customer not found: " + id));
    }

    private CustomerResponse toResponse(Customer customer) {

        return new CustomerResponse(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhone(),
                customer.getAddress()
        );
    }
}