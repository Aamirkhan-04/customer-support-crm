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
```

## Database Design

The application uses two tables.

### tickets

- id
- ticket_id
- customer_name
- customer_email
- subject
- description
- status
- created_at
- updated_at

### notes

- id
- ticket_id
- note_text
- created_at

## REST API Endpoints

### Create Ticket

```http
POST /api/tickets
```

Request:

```json
{
  "customer_name": "Aamir Khan",
  "customer_email": "aamir@gmail.com",
  "subject": "Login problem",
  "description": "Unable to login to my account"
}
```

Response:

```json
{
  "ticket_id": "TKT-001",
  "created_at": "2026-09-23T13:50:57.834267"
}
```

### Get All Tickets

```http
GET /api/tickets
```

Optional query parameters:

```text
?status=Open
?search=Aamir
?status=Open&search=Aamir
```

Response:

```json
[
  {
    "ticket_id": "TKT-001",
    "customer_name": "Aamir Khan",
    "subject": "Login problem",
    "status": "Open",
    "created_at": "2026-09-23T13:50:57.834267"
  }
]
```

### Get Ticket Details

```http
GET /api/tickets/{ticketId}
```

Example:

```http
GET /api/tickets/TKT-001
```

Response:

```json
{
  "ticket_id": "TKT-001",
  "customer_name": "Aamir Khan",
  "customer_email": "aamir@gmail.com",
  "subject": "Login problem",
  "description": "Unable to login to my account",
  "status": "Open",
  "notes": []
}
```

### Update Ticket

```http
PUT /api/tickets/{ticketId}
```

Example:

```http
PUT /api/tickets/TKT-001
```

Request:

```json
{
  "status": "In Progress",
  "notes": "Customer contacted and troubleshooting steps provided."
}
```

Response:

```json
{
  "success": true,
  "updated_at": "2026-09-23T15:30:00"
}
```

## Environment Configuration

The application uses environment variables for database configuration.

Required variables:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD
```

See `.env.example` for the required configuration format.

Example:

```text
DB_HOST=localhost
DB_PORT=3306
DB_NAME=customer_support_crm
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

The actual database password should be provided through an environment variable and should not be committed to the repository.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/customer-support-crm.git
cd customer-support-crm
```

### 2. Create the database

```sql
CREATE DATABASE customer_support_crm;
```

### 3. Configure environment variables

Set the following environment variables:

```text
DB_HOST=localhost
DB_PORT=3306
DB_NAME=customer_support_crm
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
```

### 4. Run the application

Using Maven:

```bash
./mvnw spring-boot:run
```

On Windows:

```bash
mvnw.cmd spring-boot:run
```

The application runs on:

```text
http://localhost:8080
```

## API Testing

The backend APIs were tested using Postman.

Tested functionality includes:

- Ticket creation
- Ticket listing
- Search
- Status filtering
- Search with status filtering
- Ticket detail
- Status updates
- Notes
- Validation errors
- Ticket-not-found errors
- Invalid status handling

## Frontend

The frontend is built using HTML, CSS, and vanilla JavaScript.

### Home Page

- Displays all tickets
- Search as you type
- Filter by status
- Links to ticket details
- Create Ticket navigation

### Create Ticket Page

- Customer name
- Customer email
- Issue title
- Issue description
- Ticket creation through the REST API
- Success message
- Redirect to the home page after successful creation

### Ticket Detail Page

- Ticket information
- Customer information
- Description
- Current status
- Existing notes
- Status update
- Add notes/comments

## Change Log

### Day 1 - Backend Development

- Created Spring Boot 4.0.8 project.
- Configured MySQL database.
- Created `tickets` and `notes` tables using JPA.
- Implemented Ticket entity.
- Implemented TicketNote entity.
- Implemented ticket creation API.
- Implemented ticket listing API.
- Added search functionality by ticket ID, customer name, email, and description.
- Added status filtering.
- Implemented ticket detail API with notes.
- Implemented ticket update API with status and notes.
- Added automatic ticket timestamps.
- Added request validation.
- Added global exception handling.
- Added ticket-not-found handling.
- Added invalid status handling.
- Added transactional ticket update handling.
- Tested backend APIs successfully using Postman.
- Added `.env.example` and `.gitignore`.

### Day 2 - Frontend Development

- Created the customer support CRM home dashboard.
- Added responsive ticket listing UI.
- Connected frontend with `GET /api/tickets`.
- Added search functionality.
- Added status filtering.
- Added create ticket page and form.
- Connected create ticket form with `POST /api/tickets`.
- Added automatic redirect after successful ticket creation.
- Created ticket detail page.
- Connected ticket detail page with `GET /api/tickets/{ticketId}`.
- Added ticket status update from the frontend.
- Added notes/comments functionality from the frontend.
- Connected ticket updates with `PUT /api/tickets/{ticketId}`.
- Tested the complete frontend flow successfully.

## Assignment Scope

The application implements the core customer support ticketing functionality required for the Datastraw assessment, including ticket creation, listing, search, status filtering, detailed ticket viewing, status updates, and notes.

## Deployment

The application will be deployed as a public web application before final submission.

Deployment URL: To be added after deployment.

## Submission Deliverables

- Deployed application URL
- GitHub repository
- 3–5 minute demo video
- Submission email with technical approach, architectural decisions, key features, challenges solved, and possible future improvements
