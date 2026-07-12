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

---

## Users (`/api/users`)

### `GET /api/users`
Lists users with optional filtering and pagination.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`
- **Query Parameters**:
  - `roleName` (string, optional)
  - `isActive` (boolean, optional)
  - `search` (string, optional)
  - `page` (number, optional, default: 1)
  - `pageSize` (number, optional, default: 20)
- **Response (200 OK)**: Returns a list of users and pagination details.

### `GET /api/users/:id`
Retrieves details of a specific user.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`
- **Response (200 OK)**: Returns the user profile object.
- **Error Responses**:
  - `404 Not Found`: User not found.

### `PUT /api/users/:id`
Updates a user's profile information.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`
- **Request Body** (`application/json`):
  ```json
  {
    "fullName": "Updated Name",
    "roleName": "Dispatcher",
    "isActive": true
  }
  ```
- **Response (200 OK)**: Returns the updated user object.
- **Error Responses**:
  - `403 Forbidden`: Cannot deactivate your own account.
  - `409 Conflict`: Cannot remove or deactivate the last active Admin.

### `PATCH /api/users/:id/password`
Changes the password of a user.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any (for own account) or `Admin` (for any account)
- **Request Body** (`application/json`):
  ```json
  {
    "currentPassword": "oldPassword123", 
    "newPassword": "newPassword123"
  }
  ```
  *(Note: `currentPassword` is required if changing your own password; Admins bypassing it for others can omit it)*
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Password updated successfully"
  }
  ```
- **Error Responses**:
  - `400 Bad Request`: Current password is required to change your own password.
  - `401 Unauthorized`: Current password is incorrect.
  - `403 Forbidden`: You do not have permission to change this user's password.

### `PATCH /api/users/:id/deactivate`
Deactivates a user account.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`
- **Response (200 OK)**: Returns the updated user object with `isActive: false`.

### `PATCH /api/users/:id/activate`
Activates a user account.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`
- **Response (200 OK)**: Returns the updated user object with `isActive: true`.

---

## Vehicles (`/api/vehicles`)

### `GET /api/vehicles`
Lists vehicles with optional filtering and pagination.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Query Parameters**:
  - `status` (string, optional: `Available`, `On Trip`, `In Shop`, `Retired`)
  - `vehicleType` (string, optional)
  - `region` (string, optional)
  - `search` (string, optional)
  - `page` (number, optional, default: 1)
  - `pageSize` (number, optional, default: 20)
- **Response (200 OK)**: Returns a list of vehicles and pagination details.

### `GET /api/vehicles/:id`
Retrieves details of a specific vehicle.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Response (200 OK)**: Returns the vehicle object.
- **Error Responses**:
  - `404 Not Found`: Vehicle not found.

### `POST /api/vehicles`
Registers a new vehicle in the fleet.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "registrationNumber": "XYZ-1234",
    "vehicleName": "Bus 101",
    "vehicleType": "Bus",
    "maxCapacity": 50,
    "odometer": 15000,
    "purchaseCost": 120000,
    "purchaseDate": "2024-01-15T00:00:00Z",
    "region": "Downtown"
  }
  ```
- **Response (201 Created)**: Returns the newly created vehicle with `status: Available`.
- **Error Responses**:
  - `409 Conflict`: Registration number already exists.
  - `422 Unprocessable Entity`: Validation failed.

### `PUT /api/vehicles/:id`
Updates vehicle information.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "odometer": 15500,
    "region": "Uptown"
  }
  ```
  *(Note: Updating `status` through this endpoint is forbidden and will throw an error)*
- **Response (200 OK)**: Returns the updated vehicle.
- **Error Responses**:
  - `400 Bad Request`: If `status` is passed in the body.
  - `404 Not Found`: Vehicle not found.

### `PATCH /api/vehicles/:id/retire`
Retires a vehicle from the fleet.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Response (200 OK)**: Returns the updated vehicle with `status: Retired`.
- **Error Responses**:
  - `409 Conflict`: Cannot retire a vehicle currently `'On Trip'`.

### `POST /api/vehicles/:id/photo`
Uploads a photo for the vehicle.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`multipart/form-data`):
  - `photo`: The image file (max 5MB, `.jpg`, `.png`, `.webp`)
- **Response (200 OK)**: Returns the updated vehicle with the new `photoPath`.
- **Error Responses**:
  - `400 Bad Request`: No photo uploaded, or invalid file type.
