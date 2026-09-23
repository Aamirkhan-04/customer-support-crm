# Customer Support CRM

A full-stack customer support ticketing CRM built using Java, Spring Boot, MySQL, HTML, CSS, and JavaScript.

This project was developed as part of the Datastraw AI + Tech Intern Assessment.

## Features

- Create support tickets
- Auto-generated ticket IDs
- Automatic ticket timestamps
- View all tickets
- Search tickets by:
  - Ticket ID
  - Customer name
  - Customer email
  - Description
- Filter tickets by status
- View complete ticket details
- Update ticket status
- Add notes/comments to tickets
- Validation for request data
- Structured error handling

## Technology Stack

### Backend
- Java 17
- Spring Boot 4.0.8
- Spring Web
- Spring Data JPA
- Hibernate
- Jakarta Validation

### Database
- MySQL

### Frontend
- HTML
- CSS
- JavaScript

### API Testing
- Postman

## Project Architecture

```text
Frontend
   |
   v
Spring Boot REST API
   |
   v
Service Layer
   |
   v
Repository Layer
   |
   v
MySQL Database