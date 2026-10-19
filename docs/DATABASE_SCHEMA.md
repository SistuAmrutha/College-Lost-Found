# College Lost & Found Management System - Database Schema

## Overview
The application uses **MongoDB** as its primary NoSQL document store. Collections are designed for efficient query access, high write scalability, and privacy-first data encapsulation.

---

## Collections Architecture

```
+--------------------+        +--------------------+
|       users        |<------>|       items        |
+--------------------+        +--------------------+
          ^                             ^
          |                             |
          v                             v
+--------------------+        +--------------------+
|     claims         |        |   conversations    |
+--------------------+        +--------------------+
                                        ^
                                        |
                                        v
+--------------------+        +--------------------+
|   notifications    |        |      messages      |
+--------------------+        +--------------------+
          ^
          |
+--------------------+        +--------------------+
|      reports       |        |    audit_logs      |
+--------------------+        +--------------------+
```

---

## 1. `users` Collection
Stores registered students and system administrators.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Unique user identifier |
| `fullName` | String | Required | Full name of the student or administrator |
| `collegeEmail` | String | Unique Index | Institutional `.edu` email address (used for login) |
| `collegeId` | String | Unique Index | College Roll / ID number |
| `department` | String | Required | Academic department (e.g., Computer Science, Mechanical) |
| `academicYear` | String | Required | Current academic level (Freshman, Sophomore, Junior, etc.) |
| `phoneNumber` | String | Optional | Contact phone number (hidden from public view) |
| `passwordHash` | String | Required | BCrypt-hashed password (cost factor 10) |
| `role` | String (Enum) | `ROLE_STUDENT`, `ROLE_ADMIN` | Role defining user authorization |
| `accountStatus` | String (Enum) | `ACTIVE`, `SUSPENDED` | Account moderation status |
| `avatarUrl` | String | Optional | Profile picture URL |
| `createdAt` | LocalDateTime | Default now | Registration timestamp |
| `updatedAt` | LocalDateTime | Auto-updated | Last profile modification timestamp |

**Indexes:**
- `{ collegeEmail: 1 }` (Unique)
- `{ collegeId: 1 }` (Unique)

---

## 2. `items` Collection
Stores all reported lost and found campus listings.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Unique item identifier |
| `title` | String | Required, Indexed | Title of the lost or found item |
| `type` | String (Enum) | `LOST`, `FOUND` | Whether the item was lost or discovered |
| `category` | String (Enum) | Required, Indexed | Item category (ELECTRONICS, KEYS, BAGS, etc.) |
| `description` | String | Required | Detailed description of the item |
| `campusLocation` | String | Required, Indexed | Building / classroom / outdoor campus location |
| `dateOccurred` | LocalDateTime | Required | Date and approximate time lost or found |
| `dateReported` | LocalDateTime | Indexed (Desc) | When the report was submitted |
| `status` | String (Enum) | Required, Indexed | `REPORTED`, `UNDER_REVIEW`, `VERIFIED_CLAIM`, `RESOLVED`, `ARCHIVED` |
| `imageUrls` | Array<String> | Optional | Cloudinary / uploaded photos of the item |
| `distinctiveMarks` | String | Optional | Unique marks (stickers, serial numbers, engravings) |
| `secretVerificationQuestion`| String | Optional | Question to verify legitimate owner before claim approval |
| `reporterId` | String | Indexed | `_id` of the user who submitted the listing |
| `reporterName` | String | Denormalized | Cached reporter name for high-speed listing |
| `reporterEmail` | String | Denormalized | Cached reporter institutional email |
| `createdAt` | LocalDateTime | Default now | Document creation timestamp |
| `updatedAt` | LocalDateTime | Auto-updated | Document update timestamp |

**Compound & Query Indexes:**
- `{ type: 1, status: 1, category: 1 }`
- `{ campusLocation: 1 }`
- `{ dateReported: -1 }`
- `{ reporterId: 1 }`

---

## 3. `claims` Collection
Manages ownership claims and verification workflows for discovered items.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Unique claim identifier |
| `itemId` | String | Indexed | ID of the item being claimed |
| `claimantId` | String | Indexed | ID of the student asserting ownership |
| `claimantName` | String | Denormalized | Name of the claimant |
| `claimantEmail`| String | Denormalized | College email of the claimant |
| `itemReporterId`| String | Indexed | ID of the user who posted the item |
| `proofDescription` | String | Required | Proof details (receipts, serial numbers, password proof) |
| `proofImageUrls` | Array<String> | Optional | Proof images (purchase bills, old pictures with item) |
| `contactPhone` | String | Optional | Preferred contact number for handoff |
| `additionalNotes` | String | Optional | Preferred meeting location / timing on campus |
| `status` | String (Enum) | `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED` | Claim review status |
| `reviewNotes` | String | Optional | Notes from reporter or admin explaining decision |
| `createdAt` | LocalDateTime | Default now | Claim submission timestamp |
| `updatedAt` | LocalDateTime | Auto-updated | Claim review timestamp |

**Indexes:**
- `{ itemId: 1, claimantId: 1 }`
- `{ itemReporterId: 1, status: 1 }`

---

## 4. `conversations` Collection
Tracks in-app safe communication threads between students regarding a specific item.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Conversation identifier |
| `itemId` | String | Indexed | Associated item identifier |
| `participantIds` | Array<String> | Indexed | User IDs of the 2 conversation participants |
| `participantNames` | Map<String, String> | Denormalized | Map of `userId -> fullName` |
| `lastMessage` | String | Optional | Excerpt of most recent message |
| `lastMessageTime` | LocalDateTime | Indexed (Desc) | Timestamp of latest message |
| `unreadCounts` | Map<String, Integer> | Map of `userId -> count` | Track unread messages per participant |
| `createdAt` | LocalDateTime | Default now | Conversation created timestamp |

---

## 5. `messages` Collection
Stores individual chat messages within a conversation.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Message identifier |
| `conversationId` | String | Indexed | ID of the parent conversation |
| `senderId` | String | Indexed | ID of the user sending the message |
| `senderName` | String | Denormalized | Sender's display name |
| `content` | String | Required | Message text content |
| `read` | Boolean | Default `false` | Read receipt |
| `createdAt` | LocalDateTime | Indexed | Timestamp sent |

**Indexes:**
- `{ conversationId: 1, createdAt: 1 }`

---

## 6. `notifications` Collection
Delivers system and activity alerts to students.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Notification identifier |
| `recipientId` | String | Indexed | User ID receiving the alert |
| `type` | String (Enum) | Required | `CLAIM_SUBMITTED`, `CLAIM_APPROVED`, `CLAIM_REJECTED`, `NEW_MESSAGE`, `ITEM_RESOLVED`, `SYSTEM_ALERT` |
| `title` | String | Required | Notification headline |
| `message` | String | Required | Notification description |
| `linkUrl` | String | Optional | Direct link to related item or claim |
| `read` | Boolean | Default `false`, Indexed | Read/unread status |
| `createdAt` | LocalDateTime | Indexed (Desc) | Timestamp delivered |

**Indexes:**
- `{ recipientId: 1, read: 1 }`
- `{ recipientId: 1, createdAt: -1 }`

---

## 7. `reports` Collection
Tracks abuse, fraud, and misconduct reports submitted by students for admin moderation.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Report identifier |
| `reporterId` | String | Indexed | ID of the reporting user |
| `reportedItemId` | String | Optional, Indexed | Item ID flagged as fraudulent or abusive |
| `reportedUserId` | String | Optional, Indexed | User ID flagged for harassment |
| `reason` | String (Enum) | Required | `FRAUD`, `SPAM`, `HARASSMENT`, `INAPPROPRIATE_CONTENT`, `OTHER` |
| `description` | String | Required | Description of the violation |
| `status` | String (Enum) | `PENDING`, `INVESTIGATING`, `RESOLVED`, `DISMISSED` | Moderation workflow status |
| `adminNotes` | String | Optional | Action taken by administrator |
| `createdAt` | LocalDateTime | Default now | Report timestamp |
| `updatedAt` | LocalDateTime | Auto-updated | Last moderation update timestamp |

---

## 8. `audit_logs` Collection
Immutable trail recording administrative actions and security-critical operations.

| Field Name | Type | Constraints / Index | Description |
|---|---|---|---|
| `_id` | ObjectId / String | Primary Key | Audit entry identifier |
| `adminId` | String | Indexed | Administrator user ID |
| `adminEmail` | String | Denormalized | Administrator email address |
| `action` | String | Required | e.g., `USER_SUSPENDED`, `ITEM_DELETED`, `CLAIM_OVERRIDDEN` |
| `targetType` | String | `USER`, `ITEM`, `CLAIM`, `REPORT` | Target entity type |
| `targetId` | String | Indexed | ID of the target entity |
| `details` | String | Required | Descriptive summary of the change |
| `ipAddress` | String | Optional | Client IP address |
| `timestamp` | LocalDateTime | Indexed (Desc) | Timestamp of operation |

---

## Privacy & Security Protections
1. **Password Safety:** Passwords are never stored in plaintext and never included in any API response or database query projection.
2. **Contact Masking:** Student phone numbers and sensitive verification questions are hidden from public visitors and only visible to authorized claimants or during approved handoffs.
3. **Audit Immutability:** Audit log records are write-only for administrators to prevent modification of historical security trails.
