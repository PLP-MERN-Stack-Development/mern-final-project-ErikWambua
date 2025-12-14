# 📡 MatPulse254 API Documentation

Complete API reference for the MatPulse254 Real-Time Matatu Tracking Platform.

## 📋 Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Pagination](#pagination)
- [Rate Limiting](#rate-limiting)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-endpoints)
  - [Passenger](#passenger-endpoints)
  - [Driver](#driver-endpoints)
  - [Sacco Admin](#sacco-admin-endpoints)
  - [Payments](#payment-endpoints)
  - [Trips](#trip-endpoints)
- [WebSocket Events](#websocket-events)
- [Error Codes](#error-codes)

## Overview

### Base URL

```
Development: http://localhost:5000/api
Production: https://api.matpulse254.com/api
```

### Request Format

All POST/PUT requests should use JSON:

```http
Content-Type: application/json
```

### Response Format

All responses follow this structure:

```json
{
  "success": true,
  "data": {...},
  "message": "Optional message",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}
```

Error responses:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [...]
  }
}
```

## Authentication

### JWT Token

Most endpoints require a JWT token in the Authorization header:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Token Lifecycle

- **Access Token:** Expires in 7 days
- **Refresh Token:** Expires in 30 days

### Obtaining a Token

1. **Register** or **Login** to receive an access token
2. Include the token in all authenticated requests
3. When token expires, use the refresh endpoint

## Error Handling

### HTTP Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Invalid input
- `401 Unauthorized` - Missing or invalid token
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

### Error Response Example

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Phone number is required",
    "field": "phone",
    "statusCode": 400
  }
}
```

## Pagination

List endpoints support pagination:

### Query Parameters

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field (prefix with `-` for descending)
- `search` - Search query

### Example Request

```http
GET /api/passenger/routes?page=2&limit=10&sort=-createdAt&search=westlands
```

### Paginated Response

```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}
```

## Rate Limiting

- **Default:** 100 requests per 15 minutes per IP
- **Auth endpoints:** 5 requests per 15 minutes per IP

Rate limit headers:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640000000
```

---

## API Endpoints

## Authentication Endpoints

### Register User

Create a new user account.

```http
POST /api/auth/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "phone": "+254712345678",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "passenger"
}
```

**Validation Rules:**

- `name`: Required, 2-50 characters
- `phone`: Required, valid Kenyan phone (+254...)
- `email`: Optional, valid email
- `password`: Required, min 6 characters
- `role`: Required, one of: `passenger`, `driver`

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "user_id",
      "name": "John Doe",
      "phone": "+254712345678",
      "email": "john@example.com",
      "role": "passenger",
      "isPhoneVerified": false
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Registration successful. Please verify your phone."
}
```

---

### Login

Authenticate a user.

```http
POST /api/auth/login
```

**Request Body:**

```json
{
  "phone": "+254712345678",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Verify Phone

Verify phone number with OTP code.

```http
POST /api/auth/verify-phone
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "code": "123456"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Phone verified successfully"
}
```

---

### Get Current User

Get authenticated user's profile.

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "user_id",
    "name": "John Doe",
    "phone": "+254712345678",
    "email": "john@example.com",
    "role": "passenger",
    "isPhoneVerified": true,
    "profile": {...}
  }
}
```

---

### Refresh Token

Refresh an expired access token.

```http
POST /api/auth/refresh
```

**Request Body:**

```json
{
  "refreshToken": "refresh_token_here"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "token": "new_access_token",
    "refreshToken": "new_refresh_token"
  }
}
```

---

## Passenger Endpoints

### Get Routes

Get list of available routes.

```http
GET /api/passenger/routes
Authorization: Bearer <token>
```

**Query Parameters:**

- `search` - Search by route name
- `sacco` - Filter by sacco ID
- `isActive` - Filter by active status (true/false)
- `page` - Page number
- `limit` - Items per page

**Example:**

```http
GET /api/passenger/routes?search=westlands&isActive=true&limit=10
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "route_id",
      "name": "CBD to Westlands",
      "number": "23",
      "sacco": {
        "_id": "sacco_id",
        "name": "Citi Hoppa"
      },
      "stages": [
        {
          "_id": "stage_id",
          "name": "Railways",
          "location": {
            "type": "Point",
            "coordinates": [36.8219, -1.2921]
          },
          "order": 1
        }
      ],
      "distance": 8.5,
      "estimatedDuration": 25,
      "baseFare": 50,
      "activeTrips": 5,
      "isActive": true
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "totalPages": 5
  }
}
```

---

### Get Route Trips

Get active trips for a specific route.

```http
GET /api/passenger/routes/:routeId/trips
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "trip_id",
      "route": {
        "_id": "route_id",
        "name": "CBD to Westlands"
      },
      "vehicle": {
        "_id": "vehicle_id",
        "registration": "KCA 123A",
        "capacity": 14
      },
      "driver": {
        "_id": "driver_id",
        "name": "James Kamau",
        "phone": "+254798765432"
      },
      "status": "active",
      "currentLocation": {
        "type": "Point",
        "coordinates": [36.8219, -1.2921]
      },
      "heading": 45,
      "speed": 35,
      "crowdLevel": "half",
      "currentPassengers": 7,
      "maxCapacity": 14,
      "eta": "5 minutes",
      "fare": 50,
      "scheduledDeparture": "2024-01-15T08:00:00Z",
      "isPeakHour": true,
      "trafficConditions": "moderate"
    }
  ]
}
```

---

### Create Reservation

Reserve a seat on a trip.

```http
POST /api/passenger/reservations
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "tripId": "trip_id_here",
  "pickupStageId": "stage_id",
  "dropoffStageId": "stage_id",
  "seats": 1
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "reservation": {
      "_id": "reservation_id",
      "trip": {...},
      "passenger": {...},
      "pickupStage": {...},
      "dropoffStage": {...},
      "seats": 1,
      "fare": 50,
      "status": "pending"
    },
    "payment": {
      "checkoutRequestId": "ws_CO_123456",
      "amount": 50,
      "phoneNumber": "+254712345678"
    }
  },
  "message": "Reservation created. Complete payment to confirm."
}
```

---

### Get My Reservations

Get user's reservations.

```http
GET /api/passenger/reservations
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` - Filter by status (pending, confirmed, cancelled, completed)
- `page`, `limit` - Pagination

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "reservation_id",
      "trip": {...},
      "pickupStage": {...},
      "dropoffStage": {...},
      "seats": 1,
      "fare": 50,
      "status": "confirmed",
      "payment": {
        "status": "completed",
        "transactionId": "NEF61H8S2M"
      },
      "createdAt": "2024-01-15T07:45:00Z"
    }
  ]
}
```

---

### Get Route Alerts

Get alerts for a route.

```http
GET /api/passenger/alerts
Authorization: Bearer <token>
```

**Query Parameters:**

- `routeId` - Filter by route
- `type` - Filter by alert type
- `isActive` - Filter active alerts

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "alert_id",
      "route": {...},
      "type": "traffic_jam",
      "severity": "high",
      "title": "Heavy traffic on Waiyaki Way",
      "message": "Expect 15-20 minute delays",
      "location": {...},
      "isActive": true,
      "createdAt": "2024-01-15T08:30:00Z"
    }
  ]
}
```

---

### Add Favorite Route

Add a route to favorites.

```http
POST /api/passenger/favorites
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "routeId": "route_id_here"
}
```

**Response:** `200 OK`

---

### Get Favorite Routes

Get user's favorite routes.

```http
GET /api/passenger/favorites
Authorization: Bearer <token>
```

**Response:** `200 OK`

---

## Driver Endpoints

### Start Trip

Start a new trip.

```http
POST /api/driver/trips/start
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "routeId": "route_id_here",
  "vehicleId": "vehicle_id_here",
  "scheduledDeparture": "2024-01-15T08:00:00Z"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "trip": {
      "_id": "trip_id",
      "route": {...},
      "vehicle": {...},
      "driver": {...},
      "status": "scheduled",
      "scheduledDeparture": "2024-01-15T08:00:00Z"
    }
  },
  "message": "Trip created successfully"
}
```

---

### Update Trip Location

Update vehicle's current location.

```http
PUT /api/driver/trips/:tripId/location
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "coordinates": [36.8219, -1.2921],
  "heading": 45,
  "speed": 40
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "message": "Location updated successfully"
}
```

---

### Update Trip Status

Change trip status.

```http
PUT /api/driver/trips/:tripId/status
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "status": "active"
}
```

**Valid Statuses:**

- `scheduled` → `boarding` → `active` → `completed`
- Any status → `cancelled`

**Response:** `200 OK`

---

### Update Crowd Level

Update passenger count and crowd level.

```http
PUT /api/driver/trips/:tripId/crowd
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "crowdLevel": "high",
  "currentPassengers": 12
}
```

**Crowd Levels:**

- `empty` (0 passengers)
- `low` (1-30%)
- `half` (31-60%)
- `high` (61-90%)
- `full` (91-100%)
- `standing` (over capacity)

**Response:** `200 OK`

---

### Report Incident

Report an incident during a trip.

```http
POST /api/driver/trips/:tripId/incident
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "type": "breakdown",
  "severity": "high",
  "description": "Engine overheating",
  "location": {
    "type": "Point",
    "coordinates": [36.8219, -1.2921]
  }
}
```

**Incident Types:**

- `breakdown`
- `accident`
- `traffic_jam`
- `road_closure`
- `other`

**Response:** `201 Created`

---

### Get Driver Earnings

Get earnings statistics.

```http
GET /api/driver/earnings
Authorization: Bearer <token>
```

**Query Parameters:**

- `period` - `day`, `week`, `month`, `year`
- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)

**Example:**

```http
GET /api/driver/earnings?period=week
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "totalEarnings": 45000,
    "tripsCompleted": 28,
    "averagePerTrip": 1607,
    "peakHours": {
      "morning": 18500,
      "evening": 15200,
      "other": 11300
    },
    "dailyBreakdown": [
      {
        "date": "2024-01-08",
        "earnings": 6500,
        "trips": 4
      }
    ]
  }
}
```

---

### Get Active Trip

Get driver's currently active trip.

```http
GET /api/driver/trips/active
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "trip": {...},
    "statistics": {
      "passengersBoardedAt: 5,
      "revenue": 250,
      "duration": 45
    }
  }
}
```

---

## Sacco Admin Endpoints

### Dashboard Statistics

Get overall dashboard stats.

```http
GET /api/sacco/dashboard
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "totalVehicles": 50,
    "activeVehicles": 42,
    "totalDrivers": 75,
    "activeDrivers": 45,
    "activeTrips": 23,
    "todayTrips": 156,
    "todayRevenue": 125000,
    "weeklyRevenue": 850000,
    "monthlyRevenue": 3200000,
    "topRoutes": [
      {
        "route": {...},
        "trips": 45,
        "revenue": 25000
      }
    ],
    "vehicleUtilization": 0.84
  }
}
```

---

### Get Vehicles

Get all vehicles.

```http
GET /api/sacco/vehicles
Authorization: Bearer <token>
```

**Query Parameters:**

- `status` - Filter by status
- `search` - Search by registration
- `page`, `limit` - Pagination

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "vehicle_id",
      "registration": "KCA 123A",
      "model": "Toyota Hiace",
      "capacity": 14,
      "status": "active",
      "currentDriver": {...},
      "currentTrip": {...},
      "lastMaintenance": "2024-01-01",
      "nextMaintenance": "2024-02-01",
      "totalTrips": 450,
      "totalRevenue": 675000
    }
  ]
}
```

---

### Add Vehicle

Add a new vehicle.

```http
POST /api/sacco/vehicles
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "registration": "KCA 456B",
  "model": "Toyota Hiace",
  "capacity": 14,
  "features": ["AC", "Music System"],
  "insurance": {
    "provider": "AAR Insurance",
    "policyNumber": "POL123456",
    "expiryDate": "2024-12-31"
  }
}
```

**Response:** `201 Created`

---

### Revenue Analytics

Get detailed revenue analytics.

```http
GET /api/sacco/analytics/revenue
Authorization: Bearer <token>
```

**Query Parameters:**

- `startDate` - Start date (ISO format)
- `endDate` - End date (ISO format)
- `groupBy` - `day`, `week`, `month`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "totalRevenue": 2500000,
    "totalTrips": 1850,
    "averagePerTrip": 1351,
    "byRoute": [...],
    "byDriver": [...],
    "byVehicle": [...],
    "trends": [
      {
        "date": "2024-01-08",
        "revenue": 125000,
        "trips": 92
      }
    ]
  }
}
```

---

### Get Drivers

Get all drivers.

```http
GET /api/sacco/drivers
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "_id": "driver_id",
      "name": "James Kamau",
      "phone": "+254798765432",
      "isActive": true,
      "assignedVehicle": {...},
      "currentTrip": {...},
      "statistics": {
        "totalTrips": 450,
        "completionRate": 0.98,
        "averageRating": 4.7,
        "totalEarnings": 675000
      }
    }
  ]
}
```

---

### Send Bulk Message

Send notifications to multiple users.

```http
POST /api/sacco/communications/bulk
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "recipients": ["driver", "passenger"],
  "title": "Service Update",
  "message": "Route 23 will have limited service tomorrow",
  "channels": ["sms", "push"],
  "routeId": "route_id" // Optional
}
```

**Response:** `200 OK`

---

### Generate Report

Generate custom reports.

```http
POST /api/sacco/reports
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "type": "revenue",
  "format": "pdf",
  "startDate": "2024-01-01",
  "endDate": "2024-01-31",
  "filters": {
    "routeId": "route_id"
  }
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "reportId": "report_id",
    "downloadUrl": "https://...",
    "expiresAt": "2024-01-16T00:00:00Z"
  }
}
```

---

## Payment Endpoints

### Initiate M-Pesa Payment

Initiate M-Pesa STK Push.

```http
POST /api/payments/mpesa/stk-push
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "amount": 100,
  "phoneNumber": "+254712345678",
  "accountReference": "reservation_id",
  "description": "Seat reservation payment"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "checkoutRequestId": "ws_CO_15012024123456789",
    "merchantRequestId": "12345-67890-12345",
    "responseCode": "0",
    "responseDescription": "Success. Request accepted for processing",
    "customerMessage": "Success. Request accepted for processing"
  }
}
```

---

### Check Payment Status

Query payment status.

```http
GET /api/payments/status/:checkoutRequestId
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "status": "completed",
    "amount": 100,
    "mpesaReceiptNumber": "NEF61H8S2M",
    "transactionDate": "2024-01-15T08:30:00Z",
    "phoneNumber": "+254712345678"
  }
}
```

**Status Values:**

- `pending` - Payment initiated
- `processing` - Being processed
- `completed` - Payment successful
- `failed` - Payment failed
- `cancelled` - Payment cancelled

---

## Trip Endpoints

### Get Trip Details

Get detailed information about a trip.

```http
GET /api/trips/:tripId
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "_id": "trip_id",
    "route": {...},
    "vehicle": {...},
    "driver": {...},
    "status": "active",
    "currentLocation": {...},
    "crowdLevel": "half",
    "reservations": [...],
    "timeline": [
      {
        "stage": "departure",
        "time": "2024-01-15T08:00:00Z",
        "location": {...}
      }
    ]
  }
}
```

---

## WebSocket Events

### Connection

```javascript
const socket = io('http://localhost:5000', {
  auth: {
    token: 'your_jwt_token'
  }
});

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Client → Server Events

#### Join Trip Room

```javascript
socket.emit('join:trip', { tripId: 'trip_id_here' });
```

#### Leave Trip Room

```javascript
socket.emit('leave:trip', { tripId: 'trip_id_here' });
```

#### Update Location (Driver)

```javascript
socket.emit('trip:location:update', {
  tripId: 'trip_id',
  coordinates: [36.8219, -1.2921],
  heading: 45,
  speed: 40
});
```

#### Update Status (Driver)

```javascript
socket.emit('trip:status:update', {
  tripId: 'trip_id',
  status: 'active'
});
```

#### Update Crowd (Driver)

```javascript
socket.emit('trip:crowd:update', {
  tripId: 'trip_id',
  crowdLevel: 'high',
  currentPassengers: 12
});
```

### Server → Client Events

#### Trip Updated

```javascript
socket.on('trip:update', (data) => {
  console.log('Trip updated:', data);
  // data: { tripId, ...updatedFields }
});
```

#### Location Updated

```javascript
socket.on('trip:location:update', (data) => {
  console.log('Location updated:', data);
  // data: { tripId, currentLocation, heading, speed }
});
```

#### Status Changed

```javascript
socket.on('trip:status:update', (data) => {
  console.log('Status changed:', data);
  // data: { tripId, status, previousStatus }
});
```

#### Crowd Updated

```javascript
socket.on('trip:crowd:update', (data) => {
  console.log('Crowd updated:', data);
  // data: { tripId, crowdLevel, currentPassengers }
});
```

#### New Alert

```javascript
socket.on('alert:new', (data) => {
  console.log('New alert:', data);
  // data: { alertId, type, message, severity }
});
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `UNAUTHORIZED` | Missing or invalid authentication |
| `FORBIDDEN` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict (e.g., duplicate) |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `PAYMENT_FAILED` | Payment processing failed |
| `TRIP_FULL` | Trip capacity reached |
| `TRIP_CANCELLED` | Trip was cancelled |
| `INTERNAL_ERROR` | Server error |

---

## Best Practices

1. **Always include error handling**
2. **Use HTTPS in production**
3. **Store tokens securely**
4. **Implement request retries**
5. **Handle offline scenarios**
6. **Validate responses**
7. **Use appropriate timeouts**
8. **Log API calls for debugging**

---

## Support

For API support, contact: api@matpulse254.com

---

Last updated: January 2024
