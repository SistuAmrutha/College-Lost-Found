# College Lost & Found Management System - Setup & Execution Guide

This guide walks you through setting up and running the complete College Lost & Found web platform on a Windows computer.

---

## 1. System Prerequisites

Ensure you have the following installed on your machine:

1. **Java Development Kit (JDK 21 or later):**
   - Check version: `java -version`
   - If not installed, download from [Adoptium Eclipse Temurin](https://adoptium.net/) or Oracle JDK 21+.
2. **Apache Maven (3.8+):**
   - Check version: `mvn -version`
   - Included or can be installed via Chocolatey/Scoop or downloaded from [maven.apache.org](https://maven.apache.org/).
3. **Node.js (18+ or 20+ LTS) & npm:**
   - Check version: `node -v` and `npm -v`
   - Download from [nodejs.org](https://nodejs.org/).
4. **MongoDB:**
   - **Option A (Local):** MongoDB Community Server running on `localhost:27017` with MongoDB Compass.
   - **Option B (Cloud / Free Atlas):** A free M0 MongoDB Atlas cluster from [mongodb.com/atlas](https://www.mongodb.com/atlas).

---

## 2. Setting Up the Database

### Option A: Local MongoDB
If you have MongoDB installed locally as a Windows service, it runs automatically on:
```
mongodb://localhost:27017/college_lost_found
```
To verify local MongoDB in PowerShell:
```powershell
mongosh --eval "db.version()"
```

### Option B: MongoDB Atlas (Recommended for cloud/remote)
1. Sign up at [mongodb.com/atlas](https://www.mongodb.com/atlas) and create a free M0 cluster.
2. In **Database Access**, create a user (e.g., `lostfound_user` with password `YourPassword123`).
3. In **Network Access**, add IP `0.0.0.0/0` (Allow Access from Anywhere).
4. Click **Connect -> Drivers -> Java** and copy the URI string:
   ```
   mongodb+srv://lostfound_user:YourPassword123@cluster0.abcde.mongodb.net/college_lost_found?retryWrites=true&w=majority
   ```
5. Set this connection string in `backend/src/main/resources/application.properties` or as an environment variable `SPRING_DATA_MONGODB_URI`.

---

## 3. Pre-Seeded Demonstration Accounts

When the Spring Boot application boots for the first time, `DataSeeder.java` automatically seeds the database with realistic sample data:
- **1 Administrator Account**
- **3 Student Accounts**
- **15 Lost & Found Campus Items** (AirPods, TI-84 Calculator, North Face Backpack, Student ID, Car Keys, Hydro Flask, etc.)
- **Sample Claims, Messages, and Notifications**

### Seeded Credentials:
| Role | Full Name | Email | Password |
|---|---|---|---|
| **Administrator** | Dr. Robert Sterling | `admin@college.edu` | `Admin@123` |
| **Student** | John Doe | `john.doe@college.edu` | `Student@123` |
| **Student** | Sarah Jenkins | `sarah.jenkins@college.edu` | `Student@123` |
| **Student** | Michael Chang | `michael.chang@college.edu` | `Student@123` |

*(Tip: On the frontend Login page, convenient "1-Click Demo Login" buttons are provided for both Student and Administrator accounts!)*

---

## 4. Running the Backend (Spring Boot)

Open a PowerShell terminal in the project backend folder:

```powershell
cd C:\Users\S.Amrutha\.gemini\antigravity\scratch\college-lost-found\backend
```

### Step 4.1: Run Unit Tests
Verify that all unit tests pass:
```powershell
mvn test
```
*(All 13 comprehensive unit tests will execute against mocked dependencies and embedded MongoDB test structures.)*

### Step 4.2: Start the Backend Server
```powershell
mvn spring-boot:run
```
The backend server will start on port **8080**:
- **API Base:** `http://localhost:8080/api`
- **Swagger Documentation:** `http://localhost:8080/swagger-ui.html`

---

## 5. Running the Frontend (React + Vite)

Open a second PowerShell terminal in the project frontend folder:

```powershell
cd C:\Users\S.Amrutha\.gemini\antigravity\scratch\college-lost-found\frontend
```

### Step 5.1: Install Dependencies (if not already done)
```powershell
npm install
```

### Step 5.2: Start Vite Development Server
```powershell
npm run dev
```
The Vite development server will start on:
- **Web URL:** `http://localhost:5173`

---

## 6. End-to-End User Verification Workflow

1. Open your browser and navigate to `http://localhost:5173`.
2. **Public Home Page:**
   - Observe live statistics (total reported, active lost, items found, returned).
   - Browse the recent items carousel and campus categories.
   - Click **"Browse All Items"** to view the search and filter page.
3. **Search & Filters:**
   - Filter by status (`LOST` vs `FOUND`).
   - Filter by category (`ELECTRONICS`, `ID_CARDS_WALLETS`, `KEYS`, etc.).
   - Search by keyword (e.g., "AirPods" or "Library").
4. **Student Experience:**
   - Click **"Login"** and click **"Demo Student"** (or login with `john.doe@college.edu` / `Student@123`).
   - Click **"Report Lost Item"** or **"Report Found Item"**.
   - Fill out the form with item title, category, location, date, marks, and optional verification question.
   - Go to **"My Posts"** in the Student Dashboard to view, edit, or mark as resolved.
   - Find a found item in Browse, click **"Claim This Item"**, and submit verification proof.
   - Open **"Messages"** to chat directly with the reporter in real-time.
   - Open **"Notifications"** to see instant status updates and unread count badges.
5. **Administrator Experience:**
   - Log out and log in as **"Demo Admin"** (`admin@college.edu` / `Admin@123`).
   - Navigate to `/admin`.
   - View system-wide metrics (total users, active items, pending claims, reports).
   - Access **User Moderation** to suspend/activate accounts.
   - Access **Item Moderation** to resolve or delete reported posts.
   - Access **Abuse Reports** to review student complaints.
   - Access **Audit Logs** to inspect an immutable record of administrative actions.

---

## 7. Troubleshooting

### Port 8080 or 5173 is already in use
Find and terminate conflicting processes on Windows:
```powershell
# For Port 8080:
Get-Process -Id (Get-NetTCPConnection -LocalPort 8080).OwningProcess | Stop-Process -Force

# For Port 5173:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### MongoDB Connection Refused
If MongoDB is not running locally:
1. Start MongoDB Windows Service: `net start MongoDB`
2. Or use a free MongoDB Atlas connection string by setting:
   ```properties
   spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster0.mongodb.net/college_lost_found?retryWrites=true&w=majority
   ```
   in `backend/src/main/resources/application.properties`.

### Image Uploads (Cloudinary vs Local Fallback)
If you don't configure Cloudinary keys (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`), the application automatically activates its built-in local file storage fallback at `backend/uploads/` with zero configuration needed.
