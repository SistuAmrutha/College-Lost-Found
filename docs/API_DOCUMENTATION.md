# College Lost & Found Management System - API Documentation

## Overview
The College Lost & Found backend provides a RESTful API powered by Spring Boot 3.3.4, Spring Security 6, Spring Data MongoDB, and JJWT.

- **Base URL:** `http://localhost:8080/api`
- **Interactive Swagger / OpenAPI UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON Spec:** `http://localhost:8080/v3/api-docs`

---

## Authentication & Authorization
All secured endpoints require an HTTP Bearer Token passed in the `Authorization` header:
```http
Authorization: Bearer <jwt-token>
```

When a user logs in or registers successfully, the backend responds with a signed JWT token (default validity: 24 hours) along with the user's non-sensitive profile information.

### Role-Based Access Control (RBAC):
- **ROLE_GUEST (Public):** Browse items, filter, view item details, view public stats, view safety tips, registration, login.
- **ROLE_STUDENT:** All guest capabilities + report lost/found items, edit/delete their own posts, submit verification claims, chat in real-time messages, receive notification alerts, report inappropriate content, update student profile.
- **ROLE_ADMIN:** All student capabilities + view system-wide dashboard stats, moderate/activate/suspend user accounts, moderate/delete any reported item, review abuse reports, inspect security audit logs.

---

## 1. Authentication Endpoints (`/api/auth`)

### 1.1 Register Student
- **Method:** `POST /api/auth/register`
- **Access:** Public
- **Request Body (`RegisterRequest`):**
```json
{
  "fullName": "Alex Rivera",
  "collegeEmail": "alex.rivera@college.edu",
  "collegeId": "STU-2024-8841",
  "department": "Computer Science",
  "academicYear": "Junior (3rd Year)",
  "phoneNumber": "+1 (555) 234-5678",
  "password": "Password@123"
}
```
- **Response (`201 Created` - `AuthResponse`):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "id": "6704b1234567890abcdef01",
  "fullName": "Alex Rivera",
  "collegeEmail": "alex.rivera@college.edu",
  "collegeId": "STU-2024-8841",
  "department": "Computer Science",
  "academicYear": "Junior (3rd Year)",
  "phoneNumber": "+1 (555) 234-5678",
  "role": "ROLE_STUDENT",
  "accountStatus": "ACTIVE",
  "avatarUrl": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80",
  "createdAt": "2026-10-19T10:00:00"
}
```

### 1.2 Login
- **Method:** `POST /api/auth/login`
- **Access:** Public
- **Request Body (`LoginRequest`):**
```json
{
  "collegeEmail": "alex.rivera@college.edu",
  "password": "Password@123"
}
```
- **Response (`200 OK` - `AuthResponse`):** Same schema as register response.

### 1.3 Get Current User
- **Method:** `GET /api/auth/me`
- **Access:** Authenticated (Student / Admin)
- **Response (`200 OK` - `UserResponse`):** Current authenticated user profile without password or hash.

---

## 2. Item Endpoints (`/api/items`)

### 2.1 Search & Filter Items
- **Method:** `GET /api/items`
- **Access:** Public
- **Query Parameters:**
  - `keyword` (string): Text search across title and description
  - `type` (string): `LOST` or `FOUND`
  - `category` (string): `ELECTRONICS`, `ID_CARDS_WALLETS`, `KEYS`, `BAGS_BACKPACKS`, `BOOKS_STATIONERY`, `CLOTHING_ACCESSORIES`, `SPORTS_EQUIPMENT`, `WATER_BOTTLES`, `OTHER`
  - `campusLocation` (string): Specific campus building or area
  - `status` (string): `REPORTED`, `UNDER_REVIEW`, `VERIFIED_CLAIM`, `RESOLVED`, `ARCHIVED`
  - `startDate` (ISO string): e.g. `2026-10-01T00:00:00`
  - `endDate` (ISO string): e.g. `2026-10-31T23:59:59`
  - `page` (int, default `0`)
  - `size` (int, default `10`)
  - `sortBy` (string, default `dateReported`)
  - `sortDir` (string: `asc` or `desc`, default `desc`)
- **Response (`200 OK`):** Spring `Page<ItemResponse>` containing content list, totalElements, totalPages, number, size.

### 2.2 Get Item by ID
- **Method:** `GET /api/items/{id}`
- **Access:** Public
- **Response (`200 OK` - `ItemResponse`):** Full item details. Note that private sensitive proof details are omitted for unverified guests.

### 2.3 Report Lost / Found Item
- **Method:** `POST /api/items`
- **Access:** Authenticated (Student / Admin)
- **Request Body (`CreateItemRequest`):**
```json
{
  "title": "AirPods Pro (2nd Gen) with Blue Case",
  "type": "LOST",
  "category": "ELECTRONICS",
  "description": "Lost my AirPods Pro near the 2nd floor library quiet study zone. Case has a small scratch on back.",
  "campusLocation": "Main Library - 2nd Floor Study Room B",
  "dateOccurred": "2026-10-18T14:30:00",
  "imageUrls": [
    "https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?auto=format&fit=crop&w=800&q=80"
  ],
  "distinctiveMarks": "Navy blue silicone case with small astronaut keychain",
  "secretVerificationQuestion": "What is the initial letter engraved on the interior lid?"
}
```
- **Response (`201 Created` - `ItemResponse`):** Created item object.

### 2.4 Update Item
- **Method:** `PUT /api/items/{id}`
- **Access:** Owner or Admin
- **Request Body (`UpdateItemRequest`):** Fields to update.
- **Response (`200 OK` - `ItemResponse`)**

### 2.5 Update Item Status
- **Method:** `PATCH /api/items/{id}/status`
- **Access:** Owner or Admin
- **Request Body (`UpdateItemStatusRequest`):**
```json
{
  "status": "RESOLVED"
}
```
- **Response (`200 OK` - `ItemResponse`)**

### 2.6 Delete Item
- **Method:** `DELETE /api/items/{id}`
- **Access:** Owner or Admin
- **Response (`204 No Content`)**

### 2.7 Get Public Statistics
- **Method:** `GET /api/items/stats`
- **Access:** Public
- **Response (`200 OK` - `ItemStatisticsResponse`):**
```json
{
  "totalReported": 15,
  "totalLost": 8,
  "totalFound": 7,
  "totalReturned": 6,
  "activeListings": 9,
  "resolutionRate": 40.0
}
```

### 2.8 Get User's Reported Items
- **Method:** `GET /api/items/my-posts`
- **Access:** Authenticated
- **Response (`200 OK`):** List of items reported by caller.

---

## 3. Claim & Verification Endpoints (`/api/claims`)

### 3.1 Submit Ownership Claim
- **Method:** `POST /api/claims`
- **Access:** Authenticated Student
- **Request Body (`CreateClaimRequest`):**
```json
{
  "itemId": "6704b1234567890abcdef02",
  "proofDescription": "I can identify the serial number ending in 4921 and unlock the device with my passcode.",
  "proofImageUrls": [
    "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?auto=format&fit=crop&w=800&q=80"
  ],
  "contactPhone": "+1 (555) 987-6543",
  "additionalNotes": "Available to meet at the Campus Security desk between 2-4 PM."
}
```
- **Response (`201 Created` - `ClaimResponse`)**

### 3.2 Get Claims by Item
- **Method:** `GET /api/claims/item/{itemId}`
- **Access:** Item Reporter or Admin
- **Response (`200 OK`):** List of claims submitted for this item.

### 3.3 Get User's Submitted Claims
- **Method:** `GET /api/claims/my-claims`
- **Access:** Authenticated Student
- **Response (`200 OK`):** List of claims filed by current user.

### 3.4 Update Claim Status (Approve / Reject)
- **Method:** `PATCH /api/claims/{claimId}/status`
- **Access:** Item Reporter or Admin
- **Request Body (`UpdateClaimStatusRequest`):**
```json
{
  "status": "APPROVED",
  "reviewNotes": "Proof verified via serial number and passcode match."
}
```
- **Response (`200 OK` - `ClaimResponse`)**

---

## 4. In-App Messaging Endpoints (`/api/conversations`)

### 4.1 Create or Retrieve Conversation
- **Method:** `POST /api/conversations`
- **Access:** Authenticated
- **Request Body (`CreateConversationRequest`):**
```json
{
  "itemId": "6704b1234567890abcdef02",
  "recipientId": "6704b1234567890abcdef01",
  "initialMessage": "Hello, I think this laptop charger belongs to me. Can we coordinate a handoff?"
}
```
- **Response (`200 OK` - `ConversationResponse`)**

### 4.2 List User Conversations
- **Method:** `GET /api/conversations`
- **Access:** Authenticated
- **Response (`200 OK`):** List of active conversations with unread counts.

### 4.3 Get Messages for Conversation
- **Method:** `GET /api/conversations/{id}/messages`
- **Access:** Conversation Participant
- **Response (`200 OK`):** Chronological list of `MessageResponse` objects.

### 4.4 Send Message
- **Method:** `POST /api/conversations/{id}/messages`
- **Access:** Conversation Participant
- **Request Body (`SendMessageRequest`):**
```json
{
  "content": "Sounds good! I'll be at the Student Union 1st floor helpdesk at 3:15 PM."
}
```
- **Response (`201 Created` - `MessageResponse`)**

---

## 5. Notifications Endpoints (`/api/notifications`)

- `GET /api/notifications` — Fetch user's notification list
- `GET /api/notifications/unread-count` — Count of unread notifications
- `PATCH /api/notifications/{id}/read` — Mark specific notification as read
- `PATCH /api/notifications/mark-all-read` — Mark all as read

---

## 6. Abuse Reports Endpoints (`/api/reports`)

- `POST /api/reports` — Submit report against suspicious item or abusive user
  - Body: `itemId`, `reportedUserId`, `reason` (`FRAUD`, `SPAM`, `HARASSMENT`, `INAPPROPRIATE_CONTENT`, `OTHER`), `description`.
- `GET /api/reports` — Admin only: view all reports
- `PATCH /api/reports/{id}/status` — Admin only: update status (`RESOLVED`, `DISMISSED`)

---

## 7. Admin Moderation Endpoints (`/api/admin`)

- `GET /api/admin/dashboard` — Platform overview metrics (total users, active items, pending claims, reports count, resolution rate).
- `GET /api/admin/users` — Search and manage user accounts with pagination.
- `PATCH /api/admin/users/{userId}/status` — Suspend or reactivate user (`ACTIVE`, `SUSPENDED`).
- `GET /api/admin/items` — Moderation item feed with direct resolve/remove capabilities.
- `GET /api/admin/audit-logs` — Immutable audit trail of administrative and security actions.

---

## 8. Media Uploads (`/api/uploads`)

- `POST /api/uploads/image` — Multipart form upload (`file`). Automatically uploads to Cloudinary if configured via `.env` / `application.properties`, or persists safely to `/uploads/` fallback directory. Returns `{ "imageUrl": "..." }`.
