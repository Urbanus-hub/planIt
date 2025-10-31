# Event Services Platform API Documentation

## Base URL
```
http://localhost:3000/api/
```

## Authentication

Most endpoints require authentication using JWT (JSON Web Tokens). Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

### Response Format

All API responses follow this structure:

```json
{
  "success": true/false,
  "message": "Description of the result",
  "data": {} // Response data (if applicable),
  "count": 10 // Number of items (for list endpoints)
}
```

---

## 1. User Endpoints

### 1.1 Register User

**POST** `/users/register`

Create a new user account.

**Authentication:** Not required

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client", // Optional: "client", "vendor", or "admin" (default: "client")
  "phone": "+254712345678", // Optional
  "businessName": "John's Photography" // Optional, for vendors
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "phone": "+254712345678",
    "isActive": true,
    "isVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing required fields or email already registered
- `500` - Server error

---

### 1.2 Login User

**POST** `/users/login`

Authenticate a user and receive a JWT token.

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `403` - Account deactivated
- `500` - Server error

---

### 1.3 Get Current User

**GET** `/users/me`

Get the currently authenticated user's profile.

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "phone": "+254712345678",
    "avatar": "https://example.com/avatar.jpg",
    "isActive": true,
    "isVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401` - Unauthorized (no token or invalid token)
- `404` - User not found
- `500` - Server error

---

### 1.4 Logout User

**POST** `/users/logout`

Logout the current user (client-side should discard the token).

**Authentication:** Required

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 1.5 Get All Users

**GET** `/users`

Get a list of all users (Admin only).

**Authentication:** Required (Admin only)

**Query Parameters:**
- `role` - Filter by role (client/vendor/admin)
- `isActive` - Filter by active status (true/false)

**Example Request:**
```
GET /users?role=vendor&isActive=true
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 2,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Jane Vendor",
      "email": "jane@example.com",
      "role": "vendor",
      "businessName": "Jane's Catering",
      "rating": 4.5,
      "reviewCount": 10
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied (not admin)
- `500` - Server error

---

### 1.6 Get User by ID

**GET** `/users/:id`

Get a specific user's profile (own profile or admin).

**Authentication:** Required

**URL Parameters:**
- `id` - User ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "client",
    "phone": "+254712345678"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `404` - User not found
- `500` - Server error

---

### 1.7 Update User

**PATCH** `/users/:id`

Update user profile (own profile or admin).

**Authentication:** Required

**URL Parameters:**
- `id` - User ID

**Request Body:**
```json
{
  "name": "John Updated",
  "phone": "+254700000000",
  "avatar": "https://example.com/new-avatar.jpg",
  "businessName": "Updated Business Name",
  "businessDescription": "We provide excellent services",
  "businessAddress": "123 Main Street, Nairobi"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "name": "John Updated",
    "email": "john@example.com",
    "phone": "+254700000000"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `404` - User not found
- `500` - Server error

---

### 1.8 Delete User

**DELETE** `/users/:id`

Soft delete a user (deactivate account). Admin only or own account.

**Authentication:** Required

**URL Parameters:**
- `id` - User ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Error Responses:**
- `400` - Cannot delete admin user
- `401` - Unauthorized
- `403` - Access denied
- `404` - User not found
- `500` - Server error

---

## 2. Service Endpoints

### 2.1 Create Service

**POST** `/services`

Create a new service (Vendor or Admin only).

**Authentication:** Required (Vendor/Admin)

**Request Body:**
```json
{
  "title": "Professional Wedding Photography",
  "category": "Photography",
  "description": "High-quality wedding photography with 2 photographers",
  "price": 50000,
  "pricingType": "fixed",
  "location": "Nairobi",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "availability": {
    "daysOfWeek": [0, 6],
    "timeSlots": [
      { "start": "09:00", "end": "17:00" }
    ]
  },
  "capacity": 2,
  "duration": 480,
  "tags": ["wedding", "photography", "professional"],
  "minAdvanceBooking": 7,
  "maxAdvanceBooking": 365,
  "depositRequired": true,
  "depositPercentage": 30,
  "cancellationPolicy": "Full refund if cancelled 7 days before event"
}
```

**Required Fields:**
- `title` - Service title
- `category` - One of: Photography, Catering, Decor, Entertainment, Venue, Other
- `description` - Service description
- `price` - Price in KES
- `location` - Service location

**Optional Fields:**
- `pricingType` - fixed, per-hour, per-person, custom (default: "fixed")
- `images` - Array of image URLs
- `availability` - Days and time slots available
- `capacity` - Maximum bookings per day
- `duration` - Service duration in minutes
- `tags` - Array of searchable tags
- `minAdvanceBooking` - Minimum days to book in advance
- `maxAdvanceBooking` - Maximum days to book in advance
- `depositRequired` - Whether deposit is required
- `depositPercentage` - Deposit percentage (0-100)
- `cancellationPolicy` - Cancellation policy text

**Success Response (201):**
```json
{
  "success": true,
  "message": "Service created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Professional Wedding Photography",
    "category": "Photography",
    "slug": "professional-wedding-photography",
    "description": "High-quality wedding photography",
    "price": 50000,
    "location": "Nairobi",
    "images": ["https://example.com/image1.jpg"],
    "provider": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Jane Vendor",
      "businessName": "Jane's Photography"
    },
    "isActive": true,
    "rating": 0,
    "reviewCount": 0,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields
- `401` - Unauthorized
- `403` - Access denied (not vendor/admin)
- `500` - Server error

---

### 2.2 Get All Services

**GET** `/services`

Get a list of services with optional filtering.

**Authentication:** Not required

**Query Parameters:**
- `category` - Filter by category
- `location` - Filter by location (partial match)
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `search` - Search in title, description, and tags
- `isActive` - Filter by active status (default: true)

**Example Request:**
```
GET /services?category=Photography&location=Nairobi&minPrice=10000&maxPrice=100000&search=wedding
```

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Professional Wedding Photography",
      "category": "Photography",
      "slug": "professional-wedding-photography",
      "description": "High-quality wedding photography",
      "price": 50000,
      "pricingType": "fixed",
      "location": "Nairobi",
      "images": ["https://example.com/image1.jpg"],
      "provider": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Vendor",
        "businessName": "Jane's Photography",
        "rating": 4.8,
        "reviewCount": 25
      },
      "rating": 4.9,
      "reviewCount": 12,
      "isActive": true
    }
  ]
}
```

**Error Responses:**
- `500` - Server error

---

### 2.3 Get Service by ID

**GET** `/services/:id`

Get detailed information about a specific service.

**Authentication:** Not required

**URL Parameters:**
- `id` - Service ID

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Professional Wedding Photography",
    "category": "Photography",
    "slug": "professional-wedding-photography",
    "description": "High-quality wedding photography with 2 photographers",
    "price": 50000,
    "pricingType": "fixed",
    "location": "Nairobi",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "provider": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Jane Vendor",
      "email": "jane@example.com",
      "businessName": "Jane's Photography",
      "businessDescription": "Professional photography services",
      "rating": 4.8,
      "reviewCount": 25
    },
    "availability": {
      "daysOfWeek": [0, 6],
      "timeSlots": [
        { "start": "09:00", "end": "17:00" }
      ]
    },
    "capacity": 2,
    "duration": 480,
    "tags": ["wedding", "photography", "professional"],
    "rating": 4.9,
    "reviewCount": 12,
    "isActive": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Service not found
- `500` - Server error

---

### 2.4 Update Service

**PATCH** `/services/:id`

Update a service (owner or admin only).

**Authentication:** Required (Vendor/Admin)

**URL Parameters:**
- `id` - Service ID

**Request Body:** (All fields optional)
```json
{
  "title": "Updated Service Title",
  "description": "Updated description",
  "price": 60000,
  "location": "Nairobi, Kenya",
  "images": ["https://example.com/new-image.jpg"],
  "isActive": true
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Service updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
    "title": "Updated Service Title",
    "price": 60000,
    // ... other fields
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied (not owner or admin)
- `404` - Service not found
- `500` - Server error

---

### 2.5 Delete Service

**DELETE** `/services/:id`

Soft delete a service (mark as inactive). Owner or admin only.

**Authentication:** Required (Vendor/Admin)

**URL Parameters:**
- `id` - Service ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Service deleted successfully"
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `404` - Service not found
- `500` - Server error

---

### 2.6 Get Provider Services

**GET** `/services/provider/:providerId`

Get all services by a specific provider.

**Authentication:** Not required

**URL Parameters:**
- `providerId` - Provider's user ID (optional, defaults to current user if authenticated)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Professional Wedding Photography",
      "category": "Photography",
      "price": 50000,
      "location": "Nairobi",
      "isActive": true
    }
  ]
}
```

**Error Responses:**
- `500` - Server error

---

## 3. Booking Endpoints

### 3.1 Create Booking

**POST** `/bookings`

Create a new booking for a service.

**Authentication:** Required

**Request Body:**
```json
{
  "serviceId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "date": "2024-12-25T10:00:00.000Z",
  "notes": "Wedding reception at Safari Park Hotel",
  "attendees": 150
}
```

**Required Fields:**
- `serviceId` - ID of the service to book
- `date` - Date and time of the event

**Optional Fields:**
- `notes` - Additional notes for the booking
- `attendees` - Number of attendees/guests

**Success Response (201):**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "user": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "service": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "title": "Professional Wedding Photography",
      "category": "Photography",
      "price": 50000
    },
    "provider": {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
      "name": "Jane Vendor",
      "email": "jane@example.com",
      "businessName": "Jane's Photography"
    },
    "startDate": "2024-12-25T10:00:00.000Z",
    "status": "pending",
    "paymentStatus": "unpaid",
    "notes": "Wedding reception at Safari Park Hotel",
    "attendees": 150,
    "totalPrice": 50000,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Missing required fields, service unavailable, or already booked for that date
- `401` - Unauthorized
- `404` - Service not found
- `500` - Server error

---

### 3.2 Get All Bookings

**GET** `/bookings`

Get all bookings (Admin only).

**Authentication:** Required (Admin only)

**Success Response (200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "user": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "service": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "title": "Professional Wedding Photography",
        "category": "Photography",
        "price": 50000
      },
      "provider": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Vendor",
        "businessName": "Jane's Photography"
      },
      "startDate": "2024-12-25T10:00:00.000Z",
      "status": "pending",
      "totalPrice": 50000
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied (not admin)
- `500` - Server error

---

### 3.3 Get User Bookings

**GET** `/bookings/user/:userId`

Get all bookings for a specific user (own bookings or admin).

**Authentication:** Required

**URL Parameters:**
- `userId` - User ID (optional, defaults to current user)

**Success Response (200):**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "service": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "title": "Professional Wedding Photography",
        "category": "Photography",
        "price": 50000,
        "location": "Nairobi"
      },
      "provider": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Vendor",
        "businessName": "Jane's Photography"
      },
      "startDate": "2024-12-25T10:00:00.000Z",
      "status": "confirmed",
      "paymentStatus": "paid",
      "totalPrice": 50000
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `500` - Server error

---

### 3.4 Get Service Bookings

**GET** `/bookings/service/:serviceId`

Get all bookings for a specific service (provider or admin only).

**Authentication:** Required (Vendor/Admin)

**URL Parameters:**
- `serviceId` - Service ID

**Success Response (200):**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "user": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "provider": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b4",
        "name": "Jane Vendor",
        "businessName": "Jane's Photography"
      },
      "startDate": "2024-12-25T10:00:00.000Z",
      "status": "confirmed",
      "totalPrice": 50000
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `500` - Server error

---

### 3.5 Get Provider Bookings

**GET** `/bookings/provider/:providerId`

Get all bookings for a specific provider (own bookings or admin).

**Authentication:** Required (Vendor/Admin)

**URL Parameters:**
- `providerId` - Provider's user ID (optional, defaults to current user for vendors)

**Success Response (200):**
```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
      "user": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+254712345678"
      },
      "service": {
        "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
        "title": "Professional Wedding Photography",
        "category": "Photography",
        "price": 50000
      },
      "startDate": "2024-12-25T10:00:00.000Z",
      "status": "pending",
      "notes": "Wedding reception at Safari Park Hotel",
      "attendees": 150,
      "totalPrice": 50000
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `500` - Server error

---

### 3.6 Update Booking

**PATCH** `/bookings/:id`

Update booking details (booking owner only).

**Authentication:** Required

**URL Parameters:**
- `id` - Booking ID

**Request Body:** (All fields optional)
```json
{
  "date": "2024-12-26T10:00:00.000Z",
  "notes": "Updated notes",
  "attendees": 200
}
```

**Note:** Can only update pending bookings. Confirmed, completed, cancelled, or refunded bookings cannot be updated.

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking updated successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "startDate": "2024-12-26T10:00:00.000Z",
    "notes": "Updated notes",
    "attendees": 200,
    "status": "pending"
  }
}
```

**Error Responses:**
- `400` - Cannot update completed/cancelled bookings
- `401` - Unauthorized
- `403` - Access denied (not booking owner)
- `404` - Booking not found
- `500` - Server error

---

### 3.7 Update Booking Status

**PATCH** `/bookings/:id/status`

Update the status of a booking (provider can confirm/complete, user can cancel).

**Authentication:** Required

**URL Parameters:**
- `id` - Booking ID

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Valid Status Values:**
- `pending` - Initial status
- `confirmed` - Provider confirms the booking
- `completed` - Service has been delivered
- `cancelled` - Booking is cancelled
- `refunded` - Payment has been refunded

**Status Transition Rules:**
- Only providers (or admins) can change status to `confirmed` or `completed`
- Both users and providers can `cancel` a booking
- `refunded` status typically set by admin after payment refund

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking status updated to confirmed",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "status": "confirmed",
    "confirmedAt": "2024-01-02T10:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Invalid status
- `401` - Unauthorized
- `403` - Access denied (insufficient permissions for status change)
- `404` - Booking not found
- `500` - Server error

---

### 3.8 Cancel/Delete Booking

**DELETE** `/bookings/:id`

Cancel a booking (booking owner or admin).

**Authentication:** Required

**URL Parameters:**
- `id` - Booking ID

**Success Response (200):**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "_id": "60f7b3b3b3b3b3b3b3b3b3b5",
    "status": "cancelled",
    "cancelledAt": "2024-01-02T10:00:00.000Z",
    "cancelledBy": "60f7b3b3b3b3b3b3b3b3b3b3"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Access denied
- `404` - Booking not found
- `500` - Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error message (in development mode)"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created successfully
- `400` - Bad request (validation error)
- `401` - Unauthorized (not authenticated)
- `403` - Forbidden (not authorized for this action)
- `404` - Resource not found
- `500` - Internal server error

---

## Example API Calls

### Using cURL

**Register a new user:**
```bash
curl -X POST http://localhost:3000/api/v1/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "role": "client"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:3000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

**Get services with authentication:**
```bash
curl -X GET http://localhost:3000/api/v1/services?category=Photography \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Create a booking:**
```bash
curl -X POST http://localhost:3000/api/v1/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "serviceId": "60f7b3b3b3b3b3b3b3b3b3b3",
    "date": "2024-12-25T10:00:00.000Z",
    "notes": "Wedding event",
    "attendees": 150
  }'
```

### Using JavaScript (Fetch API)

**Register:**
```javascript
const response = await fetch('http://localhost:3000/api/v1/users/register', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'client'
  })
});

const data = await response.json();
console.log(data);
```

**Get current user:**
```javascript
const token = 'YOUR_JWT_TOKEN';

const response = await fetch('http://localhost:3000/api/v1/users/me', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const data = await response.json();
console.log(data);
```

**Create a service:**
```javascript
const token = 'YOUR_JWT_TOKEN';

const response = await fetch('http://localhost:3000/api/v1/services', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Professional Wedding Photography',
    category: 'Photography',
    description: 'High-quality wedding photography',
    price: 50000,
    location: 'Nairobi',
    images: ['https://example.com/image1.jpg']
  })
});

const data = await response.json();
console.log(data);
```

---

## Rate Limiting & Best Practices

1. **Store tokens securely** - Never expose JWT tokens in client-side code or URLs
2. **Token expiration** - Tokens expire after 7 days. Implement token refresh or re-login
3. **HTTPS in production** - Always use HTTPS in production environments
4. **Input validation** - Validate all user inputs on the client side before sending
5. **Error handling** - Always handle errors and check the `success` field in responses
6. **Pagination** - For large datasets, implement pagination (to be added in future)

---

## Postman Collection

Import this JSON into Postman for easier testing:

```json
{
  "info": {
    "name": "Event Services Platform API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000/api/v1"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

Set the `token` variable after login to automatically include it in authenticated requests.