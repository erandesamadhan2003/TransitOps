# TransitOps API Documentation

Base URL for all API routes (in local development): `http://localhost:5000`

---

## System

### `GET /health`
Verifies if the API is running and responding.
- **Auth Required**: No
- **Response (200 OK)**:
  ```json
  {
    "status": "ok",
    "timestamp": "2026-07-12T05:24:30.847Z"
  }
  ```

---

## Authentication (`/api/auth`)

### `POST /api/auth/register`
Registers a new user and assigns them a system role.
- **Auth Required**: No
- **Request Body** (`application/json`):
  ```json
  {
    "fullName": "Admin User",
    "email": "admin@example.com",
    "password": "password123",
    "roleName": "Admin" 
  }
  ```
  *(Valid Roles: `Admin`, `Fleet Manager`, `Dispatcher`, `Safety Officer`, `Financial Analyst`)*
- **Response (201 Created)**:
  ```json
  {
    "status": "success",
    "message": "User registered successfully",
    "data": {
      "id": 1,
      "fullName": "Admin User",
      "email": "admin@example.com",
      "is_active": true,
      "created_at": "2026-07-12...",
      "updated_at": "2026-07-12...",
      "role_id": 1,
      "roleName": "Admin"
    }
  }
  ```
- **Error Responses**:
  - `409 Conflict`: If the email is already registered.
  - `400 Bad Request`: If an invalid role is provided.
  - `422 Unprocessable Entity`: If validation fails (e.g., password < 8 chars).

### `POST /api/auth/login`
Authenticates a user and returns a JSON Web Token (JWT).
- **Auth Required**: No
- **Request Body** (`application/json`):
  ```json
  {
    "email": "admin@example.com",
    "password": "password123"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Login successful",
    "data": {
      "token": "eyJhbGciOiJIUzI1NiIsInR...",
      "user": {
        "id": 1,
        "fullName": "Admin User",
        "email": "admin@example.com",
        "roleName": "Admin"
      }
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Invalid email or password, or deactivated account.

### `GET /api/auth/me`
Retrieves the profile information of the currently authenticated user.
- **Auth Required**: Yes (`Bearer <token>`)
- **Headers**:
  ```http
  Authorization: Bearer <your_jwt_token_here>
  ```
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Profile retrieved successfully",
    "data": {
      "id": 1,
      "fullName": "Admin User",
      "email": "admin@example.com",
      "is_active": true,
      "created_at": "...",
      "updated_at": "...",
      "roleName": "Admin",
      "roleId": 1
    }
  }
  ```
- **Error Responses**:
  - `401 Unauthorized`: Missing, malformed, or expired token.
