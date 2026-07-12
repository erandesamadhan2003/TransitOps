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
- **Auth Required**: No (ONLY if the database has zero users, i.e., Bootstrap mode). Otherwise, Yes (`Bearer <token>`).
- **Roles Allowed**: `Admin` (If not in Bootstrap mode)
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
  - `423 Locked`: Account is locked due to 5 consecutive failed login attempts. Wait 15 minutes before trying again.

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

### `GET /api/users/import-template`
Downloads a CSV template for bulk user imports.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`
- **Response (200 OK)**: Returns a CSV file stream (`text/csv`).

### `POST /api/users/import`
Bulk imports users from a CSV file.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`
- **Request Body** (`multipart/form-data`):
  - `file`: The CSV file to import.
- **Response (200 OK)**:
  ```json
  {
    "status": "success",
    "message": "Bulk import completed",
    "data": {
      "total": 5,
      "success": 3,
      "failed": 2,
      "errors": ["Row 2: Email already exists"]
    }
  }
  ```

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
  - `format` (string, optional: `csv`)
- **Response (200 OK)**: Returns a list of vehicles and pagination details. If `format=csv`, returns a raw CSV file stream (`text/csv`).

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

### `GET /api/vehicles/:id/documents`
Lists all documents for a specific vehicle.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Response (200 OK)**: Returns a list of documents.

### `POST /api/vehicles/:id/documents`
Uploads a document (PDF/Image) for a vehicle.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`multipart/form-data`):
  - `document`: The file (max 5MB, `.pdf`, `.jpg`, `.png`, `.webp`)
  - `docType`: String describing the document (e.g., 'Insurance')
  - `expiryDate`: Optional date string
- **Response (201 Created)**: Returns the newly uploaded document record.

### `DELETE /api/vehicles/:id/documents/:docId`
Deletes a vehicle document.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Response (200 OK)**: Success message.

---

## Drivers (`/api/drivers`)

### `GET /api/drivers`
Lists drivers with optional filtering and pagination.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Query Parameters**:
  - `status` (string, optional: `Available`, `On Trip`, `Suspended`)
  - `licenseCategory` (string, optional)
  - `expiringWithinDays` (number, optional)
  - `search` (string, optional)
  - `page` (number, optional, default: 1)
  - `pageSize` (number, optional, default: 20)
  - `format` (string, optional: `csv`)
- **Response (200 OK)**: Returns a list of drivers and pagination details. If `format=csv`, returns a raw CSV file stream (`text/csv`).

### `GET /api/drivers/:id`
Retrieves details of a specific driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Response (200 OK)**: Returns the driver object.
- **Error Responses**:
  - `404 Not Found`: Driver not found.

### `POST /api/drivers`
Registers a new driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "name": "Jane Doe",
    "licenseNumber": "D1234567",
    "licenseCategory": "CDL",
    "licenseExpiry": "2027-01-01T00:00:00Z",
    "contactNumber": "555-0101",
    "safetyScore": 100
  }
  ```
- **Response (201 Created)**: Returns the newly created driver with `status: Available`.
- **Error Responses**:
  - `409 Conflict`: License number already exists.
  - `400 Bad Request`: License expiry is not a future date.

### `PUT /api/drivers/:id`
Updates driver profile information.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "contactNumber": "555-0102"
  }
  ```
  *(Note: Updating `status` or `safetyScore` through this endpoint is forbidden and will throw an error)*
- **Response (200 OK)**: Returns the updated driver.
- **Error Responses**:
  - `400 Bad Request`: If `status` or `safetyScore` are passed in the body.
  - `404 Not Found`: Driver not found.

### `PATCH /api/drivers/:id/safety-score`
Updates the safety score of a driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Safety Officer`
- **Request Body** (`application/json`):
  ```json
  {
    "safetyScore": 95
  }
  ```
- **Response (200 OK)**: Returns the driver with the updated safety score.
- **Error Responses**:
  - `400 Bad Request`: If score is outside 0-100 range.

### `PATCH /api/drivers/:id/suspend`
Suspends a driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Safety Officer`
- **Response (200 OK)**: Returns the updated driver with `status: Suspended`.
- **Error Responses**:
  - `409 Conflict`: Cannot suspend a driver currently `'On Trip'`.

### `PATCH /api/drivers/:id/reinstate`
Reinstates a suspended driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Safety Officer`
- **Response (200 OK)**: Returns the updated driver with `status: Available`.
- **Error Responses**:
  - `409 Conflict`: Cannot reinstate if their license is expired.

### `PATCH /api/drivers/:id/off-duty`
Sets an Available driver to Off Duty (manually unavailable, but not suspended).
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`, `Safety Officer`
- **Response (200 OK)**: Returns the updated driver with `status: Off Duty`.
- **Error Responses**:
  - `409 Conflict`: Driver is `On Trip` or `Suspended`.

### `PATCH /api/drivers/:id/wake`
Returns an Off Duty driver to Available status.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`, `Safety Officer`
- **Response (200 OK)**: Returns the updated driver with `status: Available`.
- **Error Responses**:
  - `409 Conflict`: Driver is not currently `Off Duty`.

### `POST /api/drivers/:id/photo`
Uploads a photo for the driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`multipart/form-data`):
  - `photo`: The image file (max 5MB, `.jpg`, `.png`, `.webp`)
- **Response (200 OK)**: Returns the updated driver with the new `photoPath`.
- **Error Responses**:
  - `400 Bad Request`: No photo uploaded, or invalid file type.

### `GET /api/drivers/:id/documents`
Lists all documents for a specific driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`, `Safety Officer`
- **Response (200 OK)**: Returns a list of documents.

### `POST /api/drivers/:id/documents`
Uploads a document (PDF/Image) for a driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`, `Safety Officer`
- **Request Body** (`multipart/form-data`):
  - `document`: The file (max 5MB, `.pdf`, `.jpg`, `.png`, `.webp`)
  - `docType`: String describing the document (e.g., 'License Scan')
  - `expiryDate`: Optional date string
- **Response (201 Created)**: Returns the newly uploaded document record.

### `DELETE /api/drivers/:id/documents/:docId`
Deletes a driver document.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`, `Safety Officer`
- **Response (200 OK)**: Success message.

---

## Trips (`/api/trips`)

### `GET /api/trips`
Lists trips with optional filtering and pagination. Also joins vehicle and driver data to return readable names.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Query Parameters**:
  - `status` (string, optional: `Draft`, `Dispatched`, `Completed`, `Cancelled`)
  - `vehicleId` (number, optional)
  - `driverId` (number, optional)
  - `dateFrom` (string ISO8601, optional)
  - `dateTo` (string ISO8601, optional)
  - `search` (string, optional: searches source and destination)
  - `page` (number, optional, default: 1)
  - `pageSize` (number, optional, default: 20)
  - `format` (string, optional: `csv`)
- **Response (200 OK)**: Returns a list of trips and pagination details. If `format=csv`, returns a raw CSV file stream (`text/csv`).

### `GET /api/trips/:id`
Retrieves details of a specific trip.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Response (200 OK)**: Returns the trip object.
- **Error Responses**:
  - `404 Not Found`: Trip not found.

### `POST /api/trips`
Creates a new draft trip.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Dispatcher`
- **Request Body** (`application/json`):
  ```json
  {
    "source": "Warehouse A",
    "destination": "Store B",
    "vehicleId": 1,
    "driverId": 2,
    "cargoWeight": 4500,
    "plannedDistance": 120.5
  }
  ```
- **Response (201 Created)**: Returns the newly created trip with `status: Draft`.
- **Error Responses**:
  - `400 Bad Request`: Cargo weight exceeds the assigned vehicle's capacity.
  - `404 Not Found`: Vehicle or Driver not found.

### `PATCH /api/trips/:id/dispatch`
Dispatches a draft trip, executing an atomic lock on the assigned vehicle and driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Dispatcher`
- **Response (200 OK)**: Returns the updated trip with `status: Dispatched` and timestamps updated.
- **Error Responses**:
  - `409 Conflict`: Vehicle/Driver not available, driver license expired, or cargo weight violation.

### `PATCH /api/trips/:id/complete`
Completes a dispatched trip, releasing the locks on the assigned vehicle and driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Dispatcher`
- **Request Body** (`application/json`):
  ```json
  {
    "actualDistance": 122.0,
    "fuelConsumed": 15.5
  }
  ```
- **Response (200 OK)**: Returns the updated trip with `status: Completed`.
- **Error Responses**:
  - `409 Conflict`: Trip is not currently dispatched.

### `PATCH /api/trips/:id/cancel`
Cancels a trip. If the trip was currently dispatched, it atomically releases the locks on the vehicle and driver.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Dispatcher`
- **Response (200 OK)**: Returns the updated trip with `status: Cancelled`.
- **Error Responses**:
  - `409 Conflict`: Trip is already completed or cancelled.

---

## Maintenance (`/api/maintenance`)

### `GET /api/maintenance`
Lists maintenance records with optional filtering and pagination. Joins vehicle data to return readable names and registration numbers.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Query Parameters**:
  - `vehicleId` (number, optional)
  - `status` (string, optional: `Open`, `Closed`)
  - `dateFrom` (string ISO8601, optional)
  - `dateTo` (string ISO8601, optional)
  - `page` (number, optional, default: 1)
  - `pageSize` (number, optional, default: 20)
- **Response (200 OK)**: Returns a list of maintenance records and pagination details.

### `GET /api/maintenance/:id`
Retrieves details of a specific maintenance record.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Response (200 OK)**: Returns the maintenance record object.
- **Error Responses**:
  - `404 Not Found`: Record not found.

### `POST /api/maintenance`
Opens a new maintenance record and atomically locks the assigned vehicle in the shop.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "vehicleId": 1,
    "issue": "Brake Replacement",
    "description": "Replacing front and rear brake pads",
    "cost": 150.00,
    "startDate": "2026-07-15T00:00:00Z"
  }
  ```
- **Response (201 Created)**: Returns the newly created record with `status: Open` and the vehicle enters `In Shop` status.
- **Error Responses**:
  - `409 Conflict`: Vehicle is currently `'On Trip'`, `'Retired'`, or already has another open maintenance record.
  - `404 Not Found`: Vehicle not found.

### `PATCH /api/maintenance/:id/close`
Closes an open maintenance record and optionally updates final cost. Atomically restores the vehicle to 'Available' (unless it was retired).
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "endDate": "2026-07-16T12:00:00Z",
    "cost": 250.00
  }
  ```
- **Response (200 OK)**: Returns the updated record with `status: Closed`.
- **Error Responses**:
  - `409 Conflict`: Record is already closed.

---

## Fuel Logs (`/api/fuel-logs`)

### `GET /api/fuel-logs`
Lists fuel logs with optional filtering and pagination.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Query Parameters**:
  - `vehicleId` (number, optional)
  - `tripId` (number, optional)
  - `dateFrom` (string ISO8601, optional)
  - `dateTo` (string ISO8601, optional)
  - `page` (number, optional, default: 1)
  - `pageSize` (number, optional, default: 20)
- **Response (200 OK)**: Returns a list of fuel logs.

### `GET /api/fuel-logs/:id`
Retrieves a specific fuel log.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Response (200 OK)**: Returns the fuel log object.

### `POST /api/fuel-logs`
Logs a new fuel purchase.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Dispatcher`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "vehicleId": 1,
    "tripId": 2,
    "liters": 50.5,
    "cost": 120.75,
    "logDate": "2026-07-16T10:00:00Z"
  }
  ```
- **Response (201 Created)**: Returns the newly created log.

### `DELETE /api/fuel-logs/:id`
Hard deletes a fuel log. Used to correct errant entries.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin` ONLY
- **Response (200 OK)**: Success message.

---

## Expenses (`/api/expenses`)

### `GET /api/expenses`
Lists general expenses with optional filtering and pagination.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Query Parameters**:
  - `vehicleId` (number, optional)
  - `tripId` (number, optional)
  - `category` (string, optional: `Fuel`, `Maintenance`, `Toll`, `Parking`, `Other`)
  - `dateFrom` (string ISO8601, optional)
  - `dateTo` (string ISO8601, optional)
  - `page` (number, optional, default: 1)
  - `pageSize` (number, optional, default: 20)
- **Response (200 OK)**: Returns a list of expenses.

### `GET /api/expenses/:id`
Retrieves a specific expense entry.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Response (200 OK)**: Returns the expense object.

### `POST /api/expenses`
Logs a new general expense. Fuel expenses are strictly rejected here to prevent double counting.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Dispatcher`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "vehicleId": 1,
    "tripId": 2,
    "category": "Toll",
    "amount": 15.00,
    "description": "Highway toll pass",
    "expenseDate": "2026-07-16T11:30:00Z"
  }
  ```
- **Response (201 Created)**: Returns the newly created expense.
- **Error Responses**:
  - `400 Bad Request`: If `category` is set to `"Fuel"`.

### `DELETE /api/expenses/:id`
Hard deletes an expense entry.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin` ONLY
- **Response (200 OK)**: Success message.

---

## Dashboard (`/api/dashboard`)

### `GET /api/dashboard/kpis`
Retrieves high-level Key Performance Indicators (KPIs) aggregated across the entire system.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user (Universal Access)
- **Query Parameters**:
  - `vehicleType` (string, optional)
  - `status` (string, optional)
  - `region` (string, optional)
- **Response (200 OK)**:
  ```json
  {
    "activeVehicles": 12,
    "availableVehicles": 5,
    "vehiclesInShop": 2,
    "retiredVehicles": 1,
    "activeTrips": 12,
    "pendingTrips": 3,
    "driversAvailable": 6,
    "driversOnTrip": 12,
    "fleetUtilizationPercent": 70.58
  }
  ```

### `GET /api/dashboard/charts`
Retrieves time-series data and distribution metrics for rendering dashboard charts.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user (Universal Access)
- **Query Parameters**:
  - `monthsBack` (number, optional, default: 6)
- **Response (200 OK)**:
  ```json
  {
    "tripsPerMonth": [ { "month": "2026-07-01T00:00:00.000Z", "count": 45 } ],
    "fuelCostPerMonth": [ { "month": "2026-07-01T00:00:00.000Z", "totalCost": 1250.00 } ],
    "maintenanceCostPerMonth": [ { "month": "2026-07-01T00:00:00.000Z", "totalCost": 450.00 } ],
    "vehicleUtilization": [ { "registrationNumber": "TRK-001", "tripCount": 15 } ]
  }
  ```

### `GET /api/dashboard/analytics`
Retrieves comprehensive analytics including per-vehicle ROI, fleet fuel efficiency, and monthly revenue.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user (Universal Access)
- **Query Parameters**:
  - `format` (string, optional: `csv`)
- **Response (200 OK)**: Returns detailed JSON objects for analytics. If `format=csv`, returns a raw CSV file stream (`text/csv`) of the `vehicles` array inside the analytics payload.

---

## Settings (`/api/settings`)

### `GET /api/settings`
Retrieves the global depot settings (depot name, currency, distance unit).
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: Any authenticated user
- **Response (200 OK)**: Returns the settings object.

### `PUT /api/settings`
Updates the global depot settings.
- **Auth Required**: Yes (`Bearer <token>`)
- **Roles Allowed**: `Admin`, `Fleet Manager`
- **Request Body** (`application/json`):
  ```json
  {
    "depotName": "New Main Depot",
    "currency": "EUR",
    "distanceUnit": "mi"
  }
  ```
- **Response (200 OK)**: Returns the updated settings object.
