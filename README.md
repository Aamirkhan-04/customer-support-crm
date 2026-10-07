# Customer Support CRM

A secure, role-based Customer Support CRM / Help Desk application built with **Java, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate, MySQL, and React**.

The application supports customer ticket creation and tracking, ticket assignment, status and priority management, comments, file attachments, user management, role-based dashboards, and protected frontend navigation.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Main Goal](#main-goal)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [User Roles](#user-roles)
- [Role Permissions](#role-permissions)
- [Application Flow](#application-flow)
- [Backend Flow](#backend-flow)
- [Frontend Flow](#frontend-flow)
- [Authentication Flow](#authentication-flow)
- [Ticket Workflow](#ticket-workflow)
- [Attachment Workflow](#attachment-workflow)
- [Project Architecture](#project-architecture)
- [Backend Package Structure](#backend-package-structure)
- [Frontend Structure](#frontend-structure)
- [Important API Endpoints](#important-api-endpoints)
- [Database Design](#database-design)
- [Security Implementation](#security-implementation)
- [Validation and Exception Handling](#validation-and-exception-handling)
- [Frontend Route Protection](#frontend-route-protection)
- [Setup and Installation](#setup-and-installation)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Testing](#testing)
- [Important Challenges Solved](#important-challenges-solved)
- [Design Decisions](#design-decisions)
- [Current Scope](#current-scope)
- [Future Improvements](#future-improvements)
- [Interview Explanation](#interview-explanation)
- [Technical Interview Questions and Answers](#technical-interview-questions-and-answers)
- [Quick Interview Revision](#quick-interview-revision)
- [Developer Notes](#developer-notes)

---

## Project Overview

Customer Support CRM is a help-desk style application where customers can create support tickets and follow their progress while internal support users handle those tickets.

The application uses **four roles**:

- **ADMIN** - manages the overall system, users, roles, assignments, and ticket operations.
- **MANAGER** - manages team tickets, assigns agents from the manager's own team, and monitors ticket workload.
- **AGENT** - works on assigned tickets, updates status and priority, and communicates through comments.
- **CUSTOMER** - creates personal support tickets, tracks them, comments, and uploads supporting files.

The backend is secured with **Spring Security and JWT**, while the frontend uses **React and React Router** with protected role-based navigation.

---

## Main Goal

The goal was to upgrade a basic customer-support ticket application into a more realistic, secure, role-based CRM.

### Core workflow

```text
Customer
   |
   | Create Ticket
   v
Ticket
   |
   +----> Manager assigns Agent
   |
   +----> Status / Priority updates
   |
   +----> Comments
   |
   +----> Attachments
   |
   v
Customer tracks progress
```

---

## Key Features

### Authentication

- Customer registration
- Login with email and password
- BCrypt password hashing
- JWT-based authentication
- Stateless API security
- Authenticated current-user endpoint
- Logout by clearing frontend session data

### Ticket Management

- Create ticket
- View tickets
- View ticket details
- Search and filter ticket data
- Update ticket information
- Update status
- Update priority
- Assign agent
- Manager team-based agent assignment
- Automatic ticket ID generation
- Ticket creation and update timestamps

### Comments

- View ticket comments
- Add comments to tickets
- Comments contain user attribution and creation time

### Attachments

- Customer can upload attachments
- File type validation
- File size validation
- Attachment metadata stored in the database
- Actual files stored in the configured upload directory
- Authenticated file viewing endpoint
- Attachment deletion endpoint

### User Management

Admin can:

- View all users
- View a user by ID
- Update user details
- Enable or disable users
- Change user roles
- Assign manager relationships

There is **no public Manager Registration**. Public registration is for customers.

### Role-Based Dashboards

Each role gets a different dashboard and navigation experience.

---

## Technology Stack

| Layer | Technology |
|---|---|
| Language | Java 17 |
| Backend | Spring Boot 4.0.8 |
| Security | Spring Security + JWT |
| Authentication | AuthenticationManager + DaoAuthenticationProvider + BCrypt |
| Persistence | Spring Data JPA |
| ORM | Hibernate |
| Validation | Jakarta Validation |
| Database | MySQL |
| API Documentation | Swagger / OpenAPI |
| API Testing | Postman |
| Frontend | React + Vite |
| Frontend Routing | React Router |
| Icons / UI Helpers | Lucide React |
| Version Control | Git + GitHub |

---

## User Roles

| Role | Main Responsibility |
|---|---|
| ADMIN | System-wide administration and user management |
| MANAGER | Team ticket management and agent assignment |
| AGENT | Works on tickets assigned to the agent |
| CUSTOMER | Creates and tracks own support tickets |

---

## Role Permissions

The backend is responsible for enforcing these permissions. The frontend only controls the user experience and navigation; security is not based only on hidden buttons.

| Action | ADMIN | MANAGER | AGENT | CUSTOMER |
|---|:---:|:---:|:---:|:---:|
| Login | ✅ | ✅ | ✅ | ✅ |
| Public registration | ❌ | ❌ | ❌ | ✅ |
| View all tickets | ✅ | Team | Assigned/relevant | Own only |
| Create ticket | ✅ | ✅ | ✅ | ✅ |
| Assign agent | ✅ | Own team | ❌ | ❌ |
| Update status | ✅ | ✅ | Assigned | ❌ |
| Update priority | ✅ | ✅ | Assigned | ❌ |
| Add comment | ✅ | ✅ | ✅ | Own ticket |
| Upload attachment | ❌ | ❌ | ❌ | ✅ |
| View attachments | ✅ | ✅ | ✅ | Own ticket |
| Manage users | ✅ | ❌ | ❌ | ❌ |
| Change role | ✅ | ❌ | ❌ | ❌ |
| Manage manager relationship | ✅ | ❌ | ❌ | ❌ |

> **Important:** Backend role checks and business/ownership checks are the real security boundary.

---

## Application Flow

### 1. Public Home Flow

The application starts with a public landing page.

```text
Home
 |
 +---- About
 |
 +---- Get Started
 |       |
 |       +---- Login
 |       |
 |       +---- Customer Registration
 |
 +---- Features
 |
 +---- Security
 |
 +---- Footer
```

There is **no Manager Registration** option.

### 2. Login Flow

```text
Login Page
   |
   | email + password
   v
POST /api/auth/login
   |
   v
Spring Security authentication
   |
   v
PasswordEncoder verifies BCrypt password
   |
   v
JWT generated
   |
   v
Frontend stores token + email + role
   |
   v
Role-based redirect
   |
   +---- ADMIN    -> /admin-dashboard
   +---- MANAGER  -> /manager-dashboard
   +---- AGENT    -> /agent-dashboard
   +---- CUSTOMER -> /customer-dashboard
```

---

## Backend Flow

The main request flow is:

```text
Browser / React Frontend
        |
        | HTTP request + Bearer JWT
        v
Spring Security Filter Chain
        |
        v
JWT Authentication Filter
        |
        v
SecurityContext
        |
        v
Controller
        |
        v
Service
        |
        v
Repository
        |
        v
MySQL
```

### Layer responsibilities

**Controller**

Handles HTTP requests, request mapping, authentication context access, response status, and API responses.

**Service**

Contains business logic, ownership rules, assignment rules, validation-related decisions, and entity processing.

**Repository**

Handles database operations using Spring Data JPA.

**Entity**

Represents persistent database data.

**DTO**

Controls API request and response data instead of exposing JPA entities directly.

**Security layer**

Authenticates users, validates JWTs, creates the authenticated context, and enforces role-based authorization.

---

## Frontend Flow

The frontend is a separate React application.

```text
Home
  |
  +---- Login
  |       |
  |       +---- ADMIN Dashboard
  |       +---- MANAGER Dashboard
  |       +---- AGENT Dashboard
  |       +---- CUSTOMER Dashboard
  |
  +---- Customer Registration
```

Protected pages use a `ProtectedRoute` component.

```text
ProtectedRoute
    |
    +---- Check token
    |
    +---- Check role
    |
    +---- Allow requested page
    |
    +---- Otherwise redirect to Login
```

`DashboardLayout` provides the shared CRM shell:

- Sidebar
- Topbar
- Breadcrumbs
- Current-user information
- Logout
- Dynamic role-based menu

---

## Authentication Flow

### Registration

Only customer registration is exposed publicly.

```text
Register.jsx
    |
    | username + email + password
    v
POST /api/auth/register
    |
    v
AuthService
    |
    +---- create user with CUSTOMER role
    |
    +---- password encoded using BCrypt
    |
    v
UserService
    |
    v
MySQL
```

### Login

```text
Login.jsx
   |
   v
POST /api/auth/login
   |
   v
AuthenticationManager
   |
   v
DaoAuthenticationProvider
   |
   +---- UserDetailsService loads user
   |
   +---- PasswordEncoder verifies password
   |
   v
Authentication successful
   |
   v
JWT Service
   |
   v
JWT returned to frontend
```

### Subsequent requests

```text
React API request
   |
   | Authorization: Bearer <JWT>
   v
JWT Filter
   |
   v
Token validation
   |
   v
Authentication placed in SecurityContext
   |
   v
Controller + @PreAuthorize
   |
   v
Service ownership/business checks
```

---

## Ticket Workflow

### Customer

```text
Customer Login
   |
   v
Create Ticket
   |
   v
Ticket created with status OPEN
   |
   v
Manager / Agent handles ticket
   |
   +---- Priority update
   +---- Status update
   +---- Comment
   +---- Attachment
   |
   v
Customer tracks progress
```

### Manager

```text
Manager Login
   |
   v
Team Tickets
   |
   v
Ticket Operations
   |
   +---- Assign ticket to team agent
   +---- Update status
   +---- Update priority
   +---- Review comments
   +---- Review attachments
```

A manager can only assign a ticket to an agent who belongs to that manager's team.

### Agent

```text
Agent Login
   |
   v
My Assigned Tickets
   |
   v
View Ticket
   |
   +---- Update status
   +---- Update priority
   +---- Add comment
   +---- View attachment
```

---

## Attachment Workflow

Attachments are handled in two parts:

### 1. Metadata

The database stores information such as:

- Attachment ID
- Original file name
- File URL/path
- Content type
- File size
- Uploader
- Created time
- Related ticket

### 2. Actual file

The file itself is stored in the configured filesystem upload directory.

Current file flow:

```text
Customer selects file
        |
        v
Frontend validates type + size
        |
        v
POST /api/tickets/{ticketId}/attachments
        |
        v
TicketAttachmentService
        |
        v
FileStorageService.saveFile()
        |
        +---- Actual file -> upload directory
        |
        +---- Metadata -> MySQL
```

### Secure view flow

Directly opening `/uploads/...` from the browser does not send the Bearer JWT. The application therefore uses an authenticated backend endpoint for viewing files:

```text
View File
   |
   v
GET /api/attachments/{attachmentId}
   |
   v
JWT authentication
   |
   v
Ticket access check
   |
   v
FileStorageService.loadFile()
   |
   v
Resource returned with content type
   |
   v
Browser opens file
```

---

## Project Architecture

```text
                    +----------------------+
                    |   React Frontend     |
                    |   Vite + Router      |
                    +----------+-----------+
                               |
                               | REST + JWT
                               v
                    +----------------------+
                    |  Spring Boot API     |
                    +----------+-----------+
                               |
                    +----------v-----------+
                    |   Spring Security    |
                    | JWT + RBAC            |
                    +----------+-----------+
                               |
                    +----------v-----------+
                    | Controllers           |
                    +----------+-----------+
                               |
                    +----------v-----------+
                    | Services              |
                    | Business Rules        |
                    +----------+-----------+
                               |
                    +----------v-----------+
                    | Spring Data JPA       |
                    +----------+-----------+
                               |
                    +----------v-----------+
                    | MySQL                 |
                    +-----------------------+

Attachments also use a local filesystem upload directory for the actual file bytes.
```

---

## Backend Package Structure

Typical backend organization:

```text
src/main/java/com/datastraw/crm/
│
├── config/
│   └── security / application configuration
│
├── controller/
│   ├── AuthController
│   ├── TicketController
│   ├── UserController
│   ├── AttachmentController
│   └── comment-related controller(s)
│
├── service/
│   ├── AuthService
│   ├── TicketService
│   ├── UserService
│   ├── TicketAttachmentService
│   ├── FileStorageService
│   ├── TicketAccessService
│   └── other business services
│
├── repository/
│   ├── UserRepository
│   ├── TicketRepository
│   ├── TicketAttachmentRepository
│   └── other JPA repositories
│
├── entity/
│   ├── User
│   ├── Ticket
│   ├── Customer
│   ├── TicketAttachment
│   └── other entities
│
├── dto/
│   ├── auth/
│   ├── user/
│   ├── ticket/
│   ├── attachment/
│   └── comment/
│
├── security/
│   ├── JWT authentication components
│   ├── UserDetails
│   ├── UserDetailsService
│   ├── AuthenticationProvider configuration
│   └── SecurityFilterChain configuration
│
└── exception/
    ├── Not-found exceptions
    ├── Validation exceptions
    ├── Conflict exceptions
    └── Global exception handling
```

---

## Frontend Structure

```text
src/
│
├── components/
│   ├── DashboardLayout.jsx
│   ├── DashboardLayout.css
│   └── ProtectedRoute.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Home.css
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Auth.css
│   │
│   ├── CustomerDashboard.jsx
│   ├── CustomerTickets.jsx
│   ├── CustomerTicketDetails.jsx
│   ├── CreateTicket.jsx
│   │
│   ├── AdminDashboard.jsx
│   ├── AdminTickets.jsx
│   ├── AdminTicketView.jsx
│   ├── AdminTicketOperations.jsx
│   ├── AdminTicketDetails.jsx
│   ├── AdminUsers.jsx
│   └── AdminUserOperations.jsx
│   │
│   ├── ManagerDashboard.jsx
│   ├── ManagerTickets.jsx
│   ├── ManagerTicketView.jsx
│   ├── ManagerTicketOperations.jsx
│   └── ManagerTicketDetails.jsx
│   │
│   ├── AgentDashboard.jsx
│   ├── AgentTickets.jsx
│   └── AgentTicketDetails.jsx
│
├── styles/
│   └── dashboard.css
│
├── App.jsx
├── main.jsx
└── index.css
```

### Frontend design structure

```text
index.css
    -> Global styles only

Auth.css
    -> Login + Register

Home.css
    -> Public landing page

DashboardLayout.css
    -> Sidebar + Topbar

dashboard.css
    -> Shared dashboard cards, tables, forms, badges, lists, messages
```

---

## Important API Endpoints

All protected endpoints require a valid JWT unless explicitly stated otherwise.

### Authentication

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Public customer registration |
| POST | `/api/auth/login` | Authenticate and return JWT |
| GET | `/api/auth/me` | Return authenticated user details |

### Users

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/users` | List users |
| GET | `/api/users/{id}` | Get user by ID |
| PUT | `/api/users/{id}` | Update user details |
| PATCH | `/api/users/{id}/status` | Enable / disable user |
| PATCH | `/api/users/{id}/role` | Change user role |
| PATCH | `/api/users/{id}/manager` | Assign manager relationship |

> The public user-registration flow is handled through `/api/auth/register` and creates customers. The old public/admin-style `POST /api/users` creation path is not part of the current UI flow.

### Tickets

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/tickets` | Create ticket |
| GET | `/api/tickets` | List tickets according to current user's role/access |
| GET | `/api/tickets/{ticketId}` | View a ticket |
| PUT | `/api/tickets/{ticketId}` | Update ticket |
| PATCH | `/api/tickets/{ticketId}/assign` | Assign agent |
| PATCH | `/api/tickets/{ticketId}/status` | Update status |
| PATCH | `/api/tickets/{ticketId}/priority` | Update priority |
| GET | `/api/tickets/team-agents` | Get manager's team agents |

### Comments

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/tickets/{ticketId}/comments` | List ticket comments |
| POST | `/api/tickets/{ticketId}/comments` | Add a comment |

### Attachments

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/tickets/{ticketId}/attachments` | Upload attachment; current endpoint is customer-only |
| GET | `/api/tickets/{ticketId}/attachments` | List attachment metadata |
| GET | `/api/attachments/{attachmentId}` | Authenticated file viewing endpoint |
| DELETE | `/api/attachments/{attachmentId}` | Delete attachment |

---

## Ticket Statuses

The application uses three ticket statuses:

```text
OPEN
IN_PROGRESS
CLOSED
```

### Status meaning

| Status | Meaning |
|---|---|
| OPEN | Ticket is waiting for support action |
| IN_PROGRESS | Ticket is currently being handled |
| CLOSED | Ticket has been completed |

---

## Ticket Priorities

The application uses four priority levels:

```text
LOW
MEDIUM
HIGH
URGENT
```

---

## Database Design

The security blueprint defines the main CRM data model around users, customers, tickets, comments, and attachments.

### Main entities

```text
User
 |
 +---- Customer profile
 |
 +---- Role
 |
 +---- Manager relationship
 |
 +---- Assigned tickets

Customer
 |
 +---- Tickets

Ticket
 |
 +---- Customer
 +---- Assigned Agent
 +---- Comments
 +---- Attachments
```

### Core tables

The target CRM model contains these main tables:

```text
roles
users
customers
tickets
ticket_comments
ticket_attachments
```

### Important Ticket fields

Typical ticket data includes:

- Database primary key `id`
- Business ticket ID `ticket_id`
- Subject
- Description
- Status
- Priority
- Customer relation
- Assigned agent relation
- Created timestamp
- Updated timestamp

A separate human-friendly `ticket_id` is used instead of exposing only the database primary key.

---

## Security Implementation

### 1. PasswordEncoder

Passwords are stored as **BCrypt hashes**, not plain text.

```text
Raw password
   |
   v
PasswordEncoder
   |
   v
BCrypt hash
   |
   v
Database
```

### 2. UserDetails

Spring Security uses `UserDetails` as the security-specific representation of the authenticated user.

### 3. UserDetailsService

Loads user data from the database during authentication.

### 4. DaoAuthenticationProvider

Connects Spring Security authentication with `UserDetailsService` and `PasswordEncoder`.

### 5. AuthenticationManager

Coordinates authentication and delegates authentication to the configured provider.

### 6. JWT Authentication Filter

Reads the Bearer token from each protected request, validates it, extracts the identity, and places an authenticated `Authentication` into the security context when valid.

### 7. SecurityContext

Stores the authenticated principal and authorities for the current request context.

### 8. @PreAuthorize

Backend endpoints use role-based method security where required.

Examples:

```java
@PreAuthorize("hasRole('ADMIN')")
```

and

```java
@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'AGENT', 'CUSTOMER')")
```

### 9. Ownership / business checks

Role checks alone are not enough.

Example:

```text
CUSTOMER + valid JWT
        |
        v
Ticket access check
        |
        +---- Own ticket -> allow
        |
        +---- Another customer's ticket -> reject
```

The same principle is used for agent assignment and manager team boundaries.

---

## Validation and Exception Handling

The application validates important request data before performing business operations.

Examples include:

- Required subject
- Required description
- Maximum subject length
- Maximum description length
- Valid ticket status
- Valid ticket priority
- Required comments
- Maximum comment length
- File size limit
- Allowed attachment types
- Invalid IDs
- Missing users
- Missing tickets
- Missing attachments
- Duplicate user data

### Attachment validation

Current allowed file types:

```text
PDF
JPG
JPEG
PNG
TXT
```

Current file-size limit:

```text
5 MB
```

---

## Frontend Route Protection

The frontend uses `ProtectedRoute` to keep role-specific screens away from unauthenticated or unauthorized users.

Example concept:

```jsx
<ProtectedRoute allowedRoles={['ADMIN']}>
  <AdminDashboard />
</ProtectedRoute>
```

If there is no token:

```text
Protected page
   |
   v
/login
```

If the user role is not allowed:

```text
Unauthorized role
   |
   v
/login
```

> Frontend route protection improves user experience, but backend authorization is still required for real security.

---

## Role-Based Frontend Navigation

### ADMIN

```text
Dashboard
   |
   +---- All Tickets
   |       |
   |       +---- View Ticket
   |
   +---- Ticket Operations
   |       |
   |       +---- Manage Ticket
   |
   +---- All Users
   |
   +---- User Operations
```

### MANAGER

```text
Dashboard
   |
   +---- Team Tickets
   |       |
   |       +---- View Ticket
   |
   +---- Ticket Operations
           |
           +---- Manage Ticket
```

### AGENT

```text
Dashboard
   |
   +---- My Assigned Tickets
           |
           +---- View Ticket
```

Open, In Progress, and Closed ticket cards use filtered ticket pages.

### CUSTOMER

```text
Dashboard
   |
   +---- My Tickets
   |       |
   |       +---- View Ticket
   |
   +---- Create Ticket
```

Open, In Progress, and Closed ticket cards use filtered ticket pages.

---

## Filtered Ticket Pages

Status cards do not display the ticket table directly on the dashboard.

Instead, they navigate to filtered pages.

### Manager

```text
/manager/tickets
/manager/tickets?status=OPEN
/manager/tickets?status=IN_PROGRESS
```

### Agent

```text
/agent/tickets
/agent/tickets?status=OPEN
/agent/tickets?status=IN_PROGRESS
/agent/tickets?status=CLOSED
```

### Customer

```text
/customer/tickets
/customer/tickets?status=OPEN
/customer/tickets?status=IN_PROGRESS
/customer/tickets?status=CLOSED
```

If a filtered count is zero, the filtered page shows an empty state instead of unrelated tickets.

---

## Setup and Installation

### Backend prerequisites

Install:

- Java 17
- Maven
- MySQL

Create the database:

```sql
CREATE DATABASE customer_support_crm;
```

Then configure the database connection using environment variables.

### Frontend prerequisites

Install:

- Node.js
- npm

Then install frontend dependencies:

```bash
npm install
```

---

## Environment Configuration

The backend uses environment-based database settings.

Required variables:

```text
DB_HOST
DB_PORT
DB_NAME
DB_USERNAME
DB_PASSWORD
```

Example local values:

```text
DB_HOST=localhost
DB_PORT=3306
DB_NAME=customer_support_crm
DB_USERNAME=root
DB_PASSWORD=your_password
```

Do not commit real passwords or secrets to GitHub.

Keep a `.env.example` file with placeholder values.

### Frontend / backend local URLs

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8080
```

The backend CORS configuration is set up for the local React frontend origin.

---

## Running the Application

### 1. Start MySQL

Make sure MySQL is running and the `customer_support_crm` database exists.

### 2. Start the Spring Boot backend

From the backend project:

```bash
mvn spring-boot:run
```

The local backend runs on port `8080` unless configured differently.

### 3. Start the React frontend

From the frontend project:

```bash
npm install
npm run dev
```

The Vite development server runs on:

```text
http://localhost:5173
```

### 4. Production build check

```bash
npm run build
```

---

## Testing

### Backend testing

Use Swagger/OpenAPI and Postman to test:

#### Authentication

- Successful registration
- Duplicate registration
- Successful login
- Wrong password
- Missing authentication token
- Invalid JWT
- Disabled user

#### Authorization

- ADMIN-only operations
- MANAGER ticket operations
- AGENT assigned-ticket operations
- CUSTOMER own-ticket restrictions
- Manager team assignment restriction

#### Tickets

- Create
- List
- Detail
- Search
- Status filtering
- Status updates
- Priority updates
- Agent assignment

#### Comments

- List comments
- Add comment
- Empty comment validation
- Maximum length validation

#### Attachments

- Upload valid PDF/JPG/JPEG/PNG/TXT
- Reject unsupported type
- Reject file larger than 5 MB
- List attachments
- View attachment with JWT
- Delete attachment where permitted

### Frontend testing

Check:

- Home page loads at `/`
- Login page loads at `/login`
- Customer registration loads at `/register`
- Role-based login redirect
- Protected route behavior
- Dynamic sidebar
- Breadcrumbs
- Filtered ticket pages
- Ticket details
- Comments
- Attachment upload for customers
- Authenticated attachment viewing
- Logout

---

## Important Challenges Solved

### 1. Attachment View returned 403

**Problem:**

Opening `/uploads/...` directly from the browser did not send the JWT Authorization header.

**Solution:**

Added an authenticated endpoint:

```text
GET /api/attachments/{attachmentId}
```

The backend checks ticket access, loads the file from storage, and returns it as a resource with the appropriate content type.

The React frontend fetches this endpoint with the Bearer JWT and opens the returned Blob in a new tab.

---

### 2. Manager could select an agent outside the manager's team

**Problem:**

A manager should only assign tickets to agents who belong to that manager's team.

**Solution:**

Added:

```text
GET /api/tickets/team-agents
```

and added backend validation so a manager cannot assign a ticket to an unrelated agent.

---

### 3. Status card with `0` opened unrelated tickets

**Problem:**

Open Tickets and In Progress cards initially navigated to the same ticket list without a filter.

**Solution:**

Added query-string based filtering:

```text
?status=OPEN
?status=IN_PROGRESS
?status=CLOSED
```

A zero-count page now shows the correct empty state.

---

### 4. Dashboard contained a full ticket table

**Problem:**

The dashboard became crowded because the ticket table was displayed below the cards.

**Solution:**

Dashboard is now an overview page containing cards only. Ticket tables are moved to separate pages.

---

### 5. Role-based navigation became difficult to maintain

**Problem:**

Showing every operation in the sidebar at all times made navigation confusing.

**Solution:**

`DashboardLayout` dynamically displays only the relevant operation for the current route, with nested items such as:

```text
All Tickets
  └── View Ticket
```

and:

```text
Ticket Operations
  └── Manage Ticket
```

---

### 6. Public Manager registration was not required

**Problem:**

The application does not need a public registration flow for managers.

**Solution:**

Public registration creates customer accounts only. Internal roles are managed through the secure user-management flow.

---

## Design Decisions

### Why JWT?

JWT allows stateless authentication for REST APIs. The server does not need to keep a traditional login session for each API request.

### Why BCrypt?

Passwords should never be stored in plain text. BCrypt stores a one-way password hash and is designed for password hashing.

### Why DTOs?

DTOs keep API contracts separate from the database entities and help avoid accidentally exposing entity fields.

### Why Service layer?

Business rules such as ticket access, agent assignment, and validation-related decisions should not be mixed into controller code.

### Why separate `ticket_id` from database `id`?

The database primary key is an internal identifier. A separate ticket ID gives the application a stable, human-friendly business identifier.

### Why separate User and Customer?

`User` handles authentication/security identity and role information, while `Customer` stores CRM-specific profile data.

### Why local file storage?

It is simple for local development. For production cloud deployment, persistent/object storage is a better option than relying on an ephemeral application filesystem.

---

## Current Scope

The implemented CRM includes:

- Public Home page
- Customer registration
- JWT login
- Four roles
- Protected React routes
- Dynamic role-based sidebar
- Admin dashboard
- Manager dashboard
- Agent dashboard
- Customer dashboard
- Ticket list pages
- Filtered ticket views
- Read-only ticket views
- Operational ticket views
- Manager team-agent assignment
- Ticket status updates
- Ticket priority updates
- Comments
- Customer file upload
- Authenticated file viewing
- User status management
- User role management
- Manager relationship management
- Common dashboard UI
- Responsive styling
- Swagger / OpenAPI support
- Postman testing support
- Environment-based MySQL configuration

---

## Future Improvements

Possible future improvements:

- Persistent object storage such as S3-compatible storage for production attachments
- Refresh token strategy
- Password reset / forgot password
- Email notifications
- Ticket pagination
- Advanced ticket search
- Audit logs
- Dashboard charts
- SLA tracking
- Full comment edit/delete workflows
- Automated tests with JUnit and MockMvc
- CI/CD pipeline
- Cloud deployment with production environment variables

These are outside the current core scope and should be added deliberately rather than changing the core security and ownership model casually.

---

# Interview Explanation

## 30-Second Project Explanation

### Easy English

> I built a Customer Support CRM using Java, Spring Boot, Spring Security, JWT, Spring Data JPA, Hibernate, MySQL, and React. Customers can register, create tickets, track ticket status, add comments, and upload attachments. Managers can manage team tickets and assign agents, agents can work on assigned tickets, and admins can manage users and roles. I used JWT for stateless authentication and Spring Security for role-based authorization. I also added ownership and team checks in the service layer so users cannot access data outside their permissions.

### Easy Hinglish

> Maine Java aur Spring Boot par Customer Support CRM banaya hai. Ismein Customer register karke ticket create aur track kar sakta hai, comments aur attachments add kar sakta hai. Manager apni team ke agents ko ticket assign kar sakta hai, Agent assigned tickets handle karta hai, aur Admin users aur roles manage karta hai. Security ke liye Spring Security aur JWT use kiya hai. Saath hi service layer mein ownership aur team checks rakhe hain, taaki user unauthorized ticket access na kar sake.

---

## Backend Flow for Interview

### Easy English

> The request first goes through the Spring Security filter chain. The JWT filter reads and validates the Bearer token and sets the authenticated user in the SecurityContext. Then the request reaches the controller. The controller calls the service layer, where business rules and access checks are applied. The service uses a JPA repository to read or save data in MySQL.

### Hinglish

> Request sabse pehle Spring Security filter chain se jaati hai. JWT filter Bearer token ko validate karta hai aur SecurityContext mein authenticated user set karta hai. Uske baad request Controller par jaati hai. Controller Service ko call karta hai. Service mein business logic aur access checks hote hain. Phir Repository ke through MySQL se data read ya save hota hai.

---

## Frontend Flow for Interview

### Easy English

> The React frontend uses React Router for navigation. Public pages are Home, Login, and Customer Registration. Protected pages use ProtectedRoute, which checks the JWT token and role. After login, the frontend stores the token and role in localStorage and redirects the user to the correct dashboard. DashboardLayout provides common sidebar, topbar, breadcrumbs, and logout functionality.

### Hinglish

> React frontend mein React Router navigation handle karta hai. Home, Login aur Customer Registration public pages hain. ProtectedRoute token aur role check karta hai. Login ke baad JWT, email aur role localStorage mein store hote hain aur user ko uske role ke dashboard par redirect karte hain. DashboardLayout common sidebar, topbar, breadcrumbs aur logout handle karta hai.

---

# Technical Interview Questions and Answers

## 1. What is the main purpose of this project?

**English:**

It is a role-based customer support system where customers create tickets and support users manage them securely.

**Hinglish:**

Ye role-based support system hai jahan customers tickets create karte hain aur support team unko securely manage karti hai.

---

## 2. Why did you use JWT?

**English:**

JWT provides stateless authentication for REST APIs. The client sends the token with each protected request.

**Hinglish:**

JWT stateless authentication deta hai. Har protected request ke saath client Bearer token bhejta hai.

---

## 3. How does login work?

**English:**

The login request goes to AuthenticationManager. DaoAuthenticationProvider loads the user, PasswordEncoder checks the BCrypt password, and then a JWT is generated for the authenticated user.

**Hinglish:**

Login request AuthenticationManager ke paas jaati hai. DaoAuthenticationProvider user load karta hai, PasswordEncoder BCrypt password verify karta hai, aur successful authentication ke baad JWT milta hai.

---

## 4. What is the role of UserDetailsService?

**English:**

It loads user information from the data source for Spring Security authentication.

**Hinglish:**

Ye database se user ki security-related information load karta hai authentication ke time.

---

## 5. Why do you need UserDetails if you already have a User entity?

**English:**

The User entity is my application data model, while UserDetails is the Spring Security-specific representation used during authentication and authorization.

**Hinglish:**

User entity application ka database model hai, jabki UserDetails Spring Security ka security-specific user representation hai.

---

## 6. What is DaoAuthenticationProvider?

**English:**

It connects Spring Security authentication with UserDetailsService and PasswordEncoder.

**Hinglish:**

Ye authentication process mein UserDetailsService aur PasswordEncoder ko connect karta hai.

---

## 7. What is AuthenticationManager?

**English:**

It is the main authentication entry point that delegates authentication to the configured AuthenticationProvider.

**Hinglish:**

AuthenticationManager main authentication coordinator hai jo configured provider ko authentication ka kaam deta hai.

---

## 8. Why use BCrypt?

**English:**

Because passwords should not be stored in plain text. BCrypt creates a one-way password hash.

**Hinglish:**

Password plain text mein nahi rakhna chahiye. BCrypt one-way hash create karta hai.

---

## 9. What is SecurityContext?

**English:**

It stores the Authentication information for the current request context.

**Hinglish:**

Current authenticated user aur uski authorities ki information request context mein SecurityContext mein rehti hai.

---

## 10. What is the difference between 401 and 403?

**English:**

401 means the request is not properly authenticated. 403 means the user is authenticated but does not have permission.

**Hinglish:**

401 ka matlab authentication missing ya invalid hai. 403 ka matlab user authenticated hai lekin permission nahi hai.

---

## 11. How do you stop a customer from opening another customer's ticket?

**English:**

I use backend ticket access checks in the service layer. The authenticated customer is compared with the ticket owner before access is allowed.

**Hinglish:**

Service layer mein ticket ownership check hota hai. Current authenticated customer aur ticket owner match hone par hi access milta hai.

---

## 12. How do you stop a manager from assigning an unrelated agent?

**English:**

The backend checks that the selected agent belongs to the current manager's team before assignment.

**Hinglish:**

Backend check karta hai ki selected agent current manager ki team ka member hai ya nahi. Tabhi assignment allow hota hai.

---

## 13. Why use DTOs?

**English:**

DTOs control what enters and leaves the API and keep the API contract separate from JPA entities.

**Hinglish:**

DTOs API ka input-output control karte hain aur entity ko directly expose hone se bachate hain.

---

## 14. Why have both Controller and Service?

**English:**

The controller handles HTTP concerns, while the service contains business logic and access rules.

**Hinglish:**

Controller HTTP request handle karta hai, Service business logic aur access rules handle karta hai.

---

## 15. Why use Spring Data JPA?

**English:**

It reduces boilerplate database code and provides repository-based persistence using JPA and Hibernate.

**Hinglish:**

Spring Data JPA repetitive database code kam karta hai aur Repository ke through persistence easy banata hai.

---

## 16. Why use Hibernate?

**English:**

Hibernate acts as the ORM implementation and maps Java objects to relational database data.

**Hinglish:**

Hibernate ORM hai jo Java objects aur database tables ke beech mapping handle karta hai.

---

## 17. Why separate User and Customer?

**English:**

User contains authentication and role information, while Customer stores CRM-specific customer profile information.

**Hinglish:**

User login/security ke liye hai, Customer CRM profile ke liye.

---

## 18. Why separate ticket_id from id?

**English:**

The database `id` is an internal primary key, while `ticket_id` is a business-friendly ticket identifier used by the application.

**Hinglish:**

`id` internal database primary key hai, aur `ticket_id` user-facing business identifier hai.

---

## 19. How does the frontend know which dashboard to open?

**English:**

The login response contains the role. The frontend stores the role and uses React Router navigation to open the correct dashboard.

**Hinglish:**

Login response mein role milta hai. Frontend role ko store karke us role ke dashboard par navigate karta hai.

---

## 20. How is frontend authorization implemented?

**English:**

ProtectedRoute checks the token and allowed role before rendering protected pages.

**Hinglish:**

ProtectedRoute token aur allowed role check karta hai, tabhi protected page render hota hai.

---

## 21. Is hiding a button enough for security?

**English:**

No. The backend must enforce authorization because frontend code can be bypassed.

**Hinglish:**

Nahi. Sirf frontend button hide karna security nahi hai. Backend ko bhi authorization enforce karna chahiye.

---

## 22. Why did the attachment URL initially return 403?

**English:**

The browser was opening the filesystem upload URL directly without the Bearer JWT. The secured backend file-view endpoint solved that problem.

**Hinglish:**

Browser direct upload URL khol raha tha aur Bearer JWT nahi bhej raha tha. Isliye 403 aaya. Authenticated file-view endpoint se issue solve hua.

---

## 23. How are attachments stored?

**English:**

The database stores attachment metadata, while the actual file is stored in the configured upload directory.

**Hinglish:**

Database mein attachment ka metadata store hota hai aur actual file upload directory mein store hoti hai.

---

## 24. Why did you use Blob on the frontend for viewing attachments?

**English:**

The frontend fetches the protected file with the JWT, receives it as a Blob, creates a temporary object URL, and opens it in a new tab.

**Hinglish:**

Frontend JWT ke saath file fetch karta hai, Blob banata hai, temporary object URL create karta hai aur new tab mein open karta hai.

---

## 25. What was one important frontend challenge?

**English:**

Keeping the dashboards as overview pages without duplicating ticket tables. I moved ticket lists to separate filtered pages and kept the dashboard focused on summary cards.

**Hinglish:**

Ek important frontend challenge dashboard ko clean rakhna tha. Maine ticket table dashboard se hata kar separate filtered pages par rakhi aur dashboard ko summary cards tak limited rakha.

---

## 26. What was one important backend challenge?

**English:**

Enforcing real access rules, not only role checks. For example, managers can assign only agents from their own team and customers can access only their own tickets.

**Hinglish:**

Sirf role check enough nahi tha. Manager ke liye team check aur customer ke liye ownership check bhi lagaya.

---

## 27. Why is service-layer authorization useful?

**English:**

It keeps business rules centralized and prevents security-sensitive rules from depending only on individual controllers or the UI.

**Hinglish:**

Access aur business rules centralized rehte hain, isliye controller aur frontend dono par dependency kam hoti hai.

---

## 28. How does a manager see only relevant team tickets?

**English:**

The manager ticket query is filtered using the manager-to-agent relationship, so team tickets are based on assigned agents who belong to that manager.

**Hinglish:**

Manager ke tickets team agents ke relation ke basis par filter hote hain, isliye relevant team tickets hi milte hain.

---

## 29. Why use React Router?

**English:**

It provides client-side navigation between public pages, dashboards, ticket lists, and ticket details without a full browser reload.

**Hinglish:**

React Router frontend ke andar pages ke beech navigation handle karta hai bina full page reload ke.

---

## 30. How would you improve this project in production?

**English:**

I would add refresh tokens, stronger automated tests, pagination, audit logging, email notifications, persistent object storage for attachments, and CI/CD deployment.

**Hinglish:**

Production mein refresh token, automated tests, pagination, audit logs, email notifications, object storage aur CI/CD add karunga.

---

# Quick Interview Revision

Memorize this flow:

```text
React
  -> REST API
  -> Spring Security
  -> JWT Filter
  -> SecurityContext
  -> Controller
  -> Service
  -> Repository
  -> MySQL
```

Memorize these four roles:

```text
ADMIN
MANAGER
AGENT
CUSTOMER
```

Memorize these three statuses:

```text
OPEN
IN_PROGRESS
CLOSED
```

Memorize these four priorities:

```text
LOW
MEDIUM
HIGH
URGENT
```

Memorize these security words:

```text
JWT
BCrypt
UserDetails
UserDetailsService
AuthenticationManager
DaoAuthenticationProvider
SecurityFilterChain
SecurityContext
@PreAuthorize
```

Memorize these main frontend pieces:

```text
React
React Router
ProtectedRoute
DashboardLayout
Role-based Dashboard
```

Memorize these main backend layers:

```text
Controller
Service
Repository
Entity
DTO
Security
Exception Handling
```

---

# Developer Notes

## Local development URLs

```text
Frontend: http://localhost:5173
Backend:  http://localhost:8080
```

## Useful frontend commands

```bash
npm install
npm run dev
npm run build
```

## Useful backend command

```bash
mvn spring-boot:run
```

## Security reminder

Never commit:

- Database passwords
- JWT secrets
- Private API keys
- Production credentials
- Real environment files

Use environment variables and placeholder `.env.example` configuration instead.

## Production attachment note

Local filesystem upload is suitable for development. For production deployment, use persistent/object storage so uploaded files survive application restarts or replacement.

---

## Project Summary

This Customer Support CRM demonstrates a complete full-stack workflow:

```text
Public Home
    |
    v
Customer Registration / Login
    |
    v
JWT Authentication
    |
    v
Role-based Dashboard
    |
    +---- Admin -> Users + Roles + Ticket Operations
    |
    +---- Manager -> Team Tickets + Agent Assignment
    |
    +---- Agent -> Assigned Tickets + Status/Priority + Comments
    |
    +---- Customer -> Create/Track Tickets + Comments + Attachments
    |
    v
MySQL Persistence + Secure REST APIs
```

The main focus of the project is not only CRUD functionality, but also **authentication, authorization, ticket ownership, team-based access, validation, clean API design, separation of layers, secure attachment access, and role-based frontend workflows**.
