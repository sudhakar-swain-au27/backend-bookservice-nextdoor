# BookService Backend API - Complete Endpoint Documentation

## Base URL
`http://localhost:5050/api/v1`

## Authentication Routes (`/auth`)

### 1. Send OTP
- **Endpoint:** `POST /auth/otp/send`
- **Access:** Public
- **Body:**
  ```json
  {
    "phoneNumber": "+919876543210"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP sent successfully",
    "phoneNumber": "+919876543210"
  }
  ```

### 2. Verify OTP
- **Endpoint:** `POST /auth/otp/verify`
- **Access:** Public
- **Body:**
  ```json
  {
    "phoneNumber": "+919876543210",
    "otp": "123456"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "OTP verified successfully",
    "token": "jwt-token-here",
    "user": {
      "_id": "user-id",
      "name": "User Name",
      "phoneNumber": "+919876543210",
      "role": "user",
      "isProfileComplete": false
    }
  }
  ```

### 3. Firebase Login
- **Endpoint:** `POST /auth/firebase-login`
- **Access:** Public
- **Body:**
  ```json
  {
    "idToken": "firebase-id-token"
  }
  ```
- **Response:** Same as OTP verify

## User Routes (`/users`)

### 1. Get User Profile
- **Endpoint:** `GET /users/profile`
- **Access:** Protected (User Token Required)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User profile fetched successfully",
    "user": {
      "_id": "user-id",
      "name": "User Name",
      "email": "user@example.com",
      "phoneNumber": "+919876543210",
      "role": "user",
      "isProfileComplete": false
    }
  }
  ```

### 2. Update User Profile
- **Endpoint:** `PUT /users/profile`
- **Access:** Protected (User Token Required)
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "name": "New Name",
    "email": "newemail@example.com"
  }
  ```
- **Response:** Updated user object

### 3. Get User Bookings
- **Endpoint:** `GET /users/bookings`
- **Access:** Protected (User Token Required)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "User bookings fetched successfully",
    "bookings": [...]
  }
  ```

### 4. Delete User Account
- **Endpoint:** `DELETE /users/account`
- **Access:** Protected (User Token Required)
- **Headers:** `Authorization: Bearer <token>`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Account deleted successfully"
  }
  ```

### 5. Google OAuth
- **Endpoint:** `GET /users/google`
- **Access:** Public (Redirects to Google)

### 6. Google Callback
- **Endpoint:** `GET /users/google/callback`
- **Access:** Public

## Business Routes (`/business`)

### 1. Register Business
- **Endpoint:** `POST /business/register`
- **Access:** Public
- **Body:**
  ```json
  {
    "businessName": "Salon Name",
    "email": "business@example.com",
    "password": "password123"
  }
  ```

### 2. Business Login
- **Endpoint:** `POST /business/login`
- **Access:** Public
- **Body:**
  ```json
  {
    "email": "business@example.com",
    "password": "password123"
  }
  ```

### 3. Get Business Profile
- **Endpoint:** `GET /business/profile`
- **Access:** Protected (Business Token Required)
- **Headers:** `Authorization: Bearer <token>`

### 4. Update Business Profile
- **Endpoint:** `PUT /business/update-profile`
- **Access:** Protected (Business Token Required)

### 5. Complete Business Profile
- **Endpoint:** `POST /business/complete-profile`
- **Access:** Protected (Business Token Required)

## Services Routes (`/services`)

### 1. Get All Services
- **Endpoint:** `GET /services`
- **Access:** Public
- **Response:**
  ```json
  {
    "success": true,
    "message": "Services fetched successfully",
    "services": [
      {
        "_id": "service-id",
        "name": "Service Name",
        "description": "Service Description",
        "price": 500,
        "business": { "businessName": "Business Name" }
      }
    ]
  }
  ```

### 2. Get Single Service
- **Endpoint:** `GET /services/:serviceId`
- **Access:** Public

### 3. Get Services by Business
- **Endpoint:** `GET /services/business/:businessId`
- **Access:** Public

### 4. Add Service
- **Endpoint:** `POST /services`
- **Access:** Protected (Business Token Required)
- **Body:**
  ```json
  {
    "name": "Service Name",
    "description": "Description",
    "price": 500,
    "duration": "30 mins",
    "category": "salon",
    "imageUrl": "image-url",
    "offer": "10% OFF"
  }
  ```

### 5. Update Service
- **Endpoint:** `PUT /services/:serviceId`
- **Access:** Protected (Business Token Required)

### 6. Delete Service
- **Endpoint:** `DELETE /services/:serviceId`
- **Access:** Protected (Business Token Required)

## Bookings Routes (`/bookings`)

### 1. Create Booking
- **Endpoint:** `POST /bookings`
- **Access:** Protected (User Token Required)
- **Body:**
  ```json
  {
    "userId": "user-id",
    "businessId": "business-id",
    "serviceId": "service-id",
    "category": "salon",
    "slot": { "start": "2024-06-10T10:00:00", "end": "2024-06-10T10:30:00" },
    "location": "location-string",
    "specialInstructions": "any notes"
  }
  ```

### 2. Get All Bookings
- **Endpoint:** `GET /bookings`
- **Access:** Public

### 3. Get Booking by ID
- **Endpoint:** `GET /bookings/:id`
- **Access:** Public

### 4. Get User's Bookings
- **Endpoint:** `GET /bookings/user/:userId`
- **Access:** Protected (User Token Required)

### 5. Get Business Bookings
- **Endpoint:** `GET /bookings/business/:businessId`
- **Access:** Protected (Business Token Required)

### 6. Update Booking Status
- **Endpoint:** `PUT /bookings/:id`
- **Access:** Protected (Business Token Required)
- **Body:**
  ```json
  {
    "status": "confirmed"
  }
  ```

### 7. Delete Booking
- **Endpoint:** `DELETE /bookings/:id`
- **Access:** Protected (Business Token Required)

## Public Routes (`/public`)

### 1. Search Businesses
- **Endpoint:** `GET /public/search`
- **Access:** Public
- **Query Params:** `category`, `city`, `keyword`
- **Example:** `GET /public/search?category=salon&city=Mumbai`

### 2. Get Provider Profile by Slug
- **Endpoint:** `GET /public/provider/:slug`
- **Access:** Public

### 3. Get Business Profile by ID
- **Endpoint:** `GET /public/business/:businessId`
- **Access:** Public

## Contact Routes (`/contact`)

### 1. Submit Contact Form
- **Endpoint:** `POST /contact`
- **Access:** Public
- **Body:**
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "message": "Contact message"
  }
  ```

## Health Routes

### 1. Health Check
- **Endpoint:** `GET /health`
- **Access:** Public
- **Response:**
  ```json
  {
    "status": "Running 🚀"
  }
  ```

### 2. Root Endpoint
- **Endpoint:** `GET /`
- **Access:** Public
- **Response:** `🚀 BookService Backend is running`

## Token Format
All protected endpoints require JWT token in the header:
```
Authorization: Bearer <jwt-token>
```

The JWT token contains:
```json
{
  "id": "user-or-business-id",
  "role": "user|business",
  "phoneNumber": "optional"
}
```

## Error Responses

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Access denied. User token required."
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Summary of Fixes Applied

✅ **Fixed Issues:**
1. Removed duplicate OTP endpoints from user routes
2. Consolidated all login endpoints in auth routes
3. Added comprehensive user profile management endpoints
4. Fixed Service model populate path (businessId → business)
5. Added auth protection to booking routes
6. Fixed User model email constraint for OTP-based users
7. Enhanced public search functionality
8. Improved error handling across all controllers
9. Standardized response format across all endpoints
10. Updated Passport OAuth configuration

✅ **New Endpoints Added:**
- GET `/users/profile` - Get user profile
- PUT `/users/profile` - Update user profile
- GET `/users/bookings` - Get user's bookings
- DELETE `/users/account` - Delete user account
- GET `/services/:serviceId` - Get single service
- GET `/services/business/:businessId` - Get business services
- PUT `/services/:serviceId` - Update service
- DELETE `/services/:serviceId` - Delete service
- GET `/public/search` - Search businesses
- GET `/public/business/:businessId` - Get business profile

All endpoints have been tested and are ready for integration with the frontend.
