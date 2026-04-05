# Finance Dashboard API Documentation

This document describes the RESTful API endpoints for the Finance Dashboard.

**Base URL**: `http://localhost:5000/api/v1`

---

## 🔐 Authentication
Most endpoints require a JWT token in the header:
`Authorization: Bearer <your_jwt_token>`

### 1. Register User
*   **Method**: `POST`
*   **URL**: `/auth/register`
*   **Body**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response (201)**: Returns user object and token.

### 2. Login User
*   **Method**: `POST`
*   **URL**: `/auth/login`
*   **Body**:
    ```json
    {
      "email": "john@example.com",
      "password": "password123"
    }
    ```
*   **Response (200)**: Returns user object and token.

---

## 📊 Dashboard
### 1. Get Summary
*   **Method**: `GET`
*   **URL**: `/dashboard/summary`
*   **Auth**: Required (Viewer, Analyst, or Admin)
*   **Response (200)**: returns totals, category breakdowns, and monthly summaries.

---

## 📝 Financial Records
### 1. List Records
*   **Method**: `GET`
*   **URL**: `/records`
*   **Auth**: Required
*   **Query Params**: `page`, `limit`, `type`, `category`, `startDate`, `endDate`, `search`
*   **Response (200)**: Paginated record results.

### 2. Create Record
*   **Method**: `POST`
*   **URL**: `/records`
*   **Auth**: Required (Admin only)
*   **Body**:
    ```json
    {
      "amount": 1200.50,
      "type": "income",
      "category": "Salary",
      "date": "2024-04-05T00:00:00Z",
      "note": "April Salary"
    }
    ```

### 3. Update Record
*   **Method**: `PUT`
*   **URL**: `/records/:id`
*   **Auth**: Required (Admin only)

### 4. Delete Record (Soft Delete)
*   **Method**: `DELETE`
*   **URL**: `/records/:id`
*   **Auth**: Required (Admin only)

---

## 👥 User Management (Admin Only)
### 1. Get All Users
*   **Method**: `GET`
*   **URL**: `/users`

### 2. Create User
*   **Method**: `POST`
*   **URL**: `/users`

### 3. Update User Status/Role
*   **Method**: `PUT`
*   **URL**: `/users/:id`
