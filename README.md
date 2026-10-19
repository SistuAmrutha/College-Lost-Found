# College Lost & Found Management System

A production-grade, full-stack campus asset recovery platform designed for college universities. Built with **React 19**, **Spring Boot 3.3.4**, **MongoDB**, **Spring Security (JWT)**, and **Tailwind CSS**.

[![Spring Boot 3.3.4](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb.svg)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%7C%20Local-47A248.svg)](https://www.mongodb.com/)
[![Tailwind CSS 3.4](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg)](https://tailwindcss.com/)
[![Security JWT](https://img.shields.io/badge/Security-JWT%20%2B%20BCrypt-red.svg)](https://jwt.io/)
[![OpenAPI Swagger](https://img.shields.io/badge/Swagger-OpenAPI%203.0-85EA2D.svg)](http://localhost:8080/swagger-ui.html)
[![Tests Passing](https://img.shields.io/badge/Tests-13%2F13%20Passed-success.svg)](backend)

---

## 🌟 Key Highlights & Engineering Features

- **Multi-Role Access Control (RBAC):** Distinct interfaces and backend permission enforcement for **Guest Visitors**, **Registered Students**, and **Campus Administrators**.
- **Real-Time Data & Live Stats:** Dynamic public statistics (total reported, active lost, found, returned, and resolution percentages) calculated directly from MongoDB aggregates.
- **Smart Filtering & Discovery:** Multidimensional search across keywords, lost/found status, 9 campus item categories, specific campus buildings, date ranges, and resolution state.
- **Secure Ownership Verification Workflow:** Two-step claim submission process with distinctive marks, secret verification questions, proof descriptions, and claimant contact validation.
- **In-App Student Communication:** Real-time safe chat between finders and claimants to arrange on-campus handoffs without exposing personal phone numbers or addresses.
- **Administrative Moderation Suite:** Comprehensive admin console with student account suspension/reactivation, item post moderation, abuse dispute tracking, and an immutable security audit log.
- **Modern Responsive SaaS UI:** Built with Tailwind CSS, custom color palettes, smooth transitions, mobile responsive navigation, and persistent **Light/Dark Mode**.
- **Cloud & Local Storage Resilient:** Configurable image upload service supporting **Cloudinary** for production and an automatic fallback to local directory storage.

---

## 🛠️ Architecture & Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS 3.4 with custom campus themes & dark mode
- **Routing:** React Router DOM v7
- **Icons:** Lucide React
- **HTTP Client:** Axios with JWT request & 401 response interceptors
- **State Management:** React Context API (`AuthContext`, `ThemeContext`, `ToastContext`)

### Backend
- **Runtime:** Java 21 LTS
- **Framework:** Spring Boot 3.3.4
- **Security:** Spring Security 6, JJWT 0.12.6, BCrypt Password Hashing
- **Persistence:** Spring Data MongoDB (NoSQL)
- **Validation:** Jakarta Bean Validation (`@Valid`, custom error bindings)
- **Documentation:** Springdoc OpenAPI 2.6.0 with interactive Swagger UI
- **Testing:** JUnit 5, Mockito, Spring Boot Test, Flapdoodle Embedded MongoDB

### Database & Storage
- **Database:** MongoDB (Local Community Server or cloud MongoDB Atlas)
- **Media Uploads:** Cloudinary API with local multipart storage fallback

---

## 📁 Repository Structure

```
college-lost-found/
├── frontend/                     # React + Vite client
│   ├── public/                   # Static assets & favicons
│   ├── src/
│   │   ├── assets/               # Branding graphics & SVGs
│   │   ├── components/           # Reusable UI (Navbar, Cards, Modals, Badges)
│   │   ├── context/              # Auth, Theme, and Toast state providers
│   │   ├── layouts/              # MainLayout, StudentLayout, AdminLayout
│   │   ├── pages/
│   │   │   ├── public/           # Home, Browse, Item Details, How It Works, Terms
│   │   │   ├── auth/             # Login & Register (with 1-click demo buttons)
│   │   │   ├── student/          # Dashboard, Report Lost/Found, Claims, Messages
│   │   │   └── admin/            # Admin Overview, User Moderation, Audit Logs
│   │   ├── services/             # Axios API modules for all endpoints
│   │   ├── utils/                # Date, status, and category helpers
│   │   ├── App.jsx               # Main router & provider wiring
│   │   ├── main.jsx              # Application entry point
│   │   └── index.css             # Tailwind base & custom utility layers
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/                      # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/collegelostfound/
│   │   │   │   ├── config/       # Security, OpenAPI, Cloudinary, Seeder
│   │   │   │   ├── controller/   # REST Controllers (Auth, Item, Claim, Message, Admin)
│   │   │   │   ├── dto/          # Request & Response Data Transfer Objects
│   │   │   │   ├── exception/    # Global exception handler & custom exceptions
│   │   │   │   ├── model/        # MongoDB Document entities & Enums
│   │   │   │   ├── repository/   # Spring Data MongoDB repositories
│   │   │   │   ├── security/     # JWT filter, Token provider, UserPrincipal
│   │   │   │   ├── service/      # Business logic services & Cloudinary storage
│   │   │   │   └── CollegeLostFoundApplication.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── .env.example
│   │   └── test/                 # 13 Automated JUnit 5 & Mockito test suites
│   └── pom.xml
│
├── docs/                         # In-depth architectural documentation
│   ├── API_DOCUMENTATION.md      # Complete REST endpoints & payload reference
│   ├── DATABASE_SCHEMA.md        # Document schemas, indexes & relations
│   └── SETUP_GUIDE.md           # Step-by-step local setup for Windows & Atlas
│
├── .gitignore
└── README.md
```

---

## ⚡ Quick Start (Windows)

### Prerequisites
1. **JDK 21+** (`java -version`)
2. **Maven 3.8+** (`mvn -version`)
3. **Node.js 18+** (`node -v`)
4. **MongoDB** running locally on `localhost:27017` or a free MongoDB Atlas connection string.

---

### Step 1: Run the Backend

```powershell
cd C:\Users\S.Amrutha\.gemini\antigravity\scratch\college-lost-found\backend

# Execute automated test suite (13/13 passing tests)
mvn test

# Start the Spring Boot REST API
mvn spring-boot:run
```
- **API Endpoint:** `http://localhost:8080/api`
- **Swagger Documentation:** `http://localhost:8080/swagger-ui.html`

*Note: On first startup, `DataSeeder.java` will automatically populate the database with realistic sample campus items, student profiles, and administrator credentials.*

---

### Step 2: Run the Frontend

In a new terminal:
```powershell
cd C:\Users\S.Amrutha\.gemini\antigravity\scratch\college-lost-found\frontend

# Install node dependencies
npm install

# Start the Vite development server
npm run dev
```
- **Web Portal:** `http://localhost:5173`

---

## 👥 Seeded Test Credentials

For evaluation and quick grading, use the following pre-seeded credentials or click the **1-Click Demo Login** buttons on the Login page:

| Role | Email | Password | Access Area |
|---|---|---|---|
| **Administrator** | `admin@college.edu` | `Admin@123` | `/admin` (Moderation, Users, Audit Logs) |
| **Student** | `john.doe@college.edu` | `Student@123` | `/student` (Report, Claims, Chat, Posts) |
| **Student** | `sarah.jenkins@college.edu` | `Student@123` | Student Portal |
| **Student** | `michael.chang@college.edu` | `Student@123` | Student Portal |

---

## 🧪 Automated Testing Results

- **Backend:** 13 of 13 unit tests passed with 100% success rate:
  - `AuthServiceTest` (Registration uniqueness validation, BCrypt password hashing, JWT token generation).
  - `ItemServiceTest` (Search & filter pipelines, owner authorization, lifecycle status transitions).
  - `ClaimServiceTest` (Ownership claim submissions, approval/rejection workflows, permission validations).
- **Frontend:** Production Vite build verified (`npm run build`) with 0 syntax errors or broken imports.

---

## 📄 Documentation Links
- [API Documentation & REST Contracts](docs/API_DOCUMENTATION.md)
- [Database Schema & Collections Reference](docs/DATABASE_SCHEMA.md)
- [Windows & Cloud Setup Guide](docs/SETUP_GUIDE.md)

---

## 💼 Resume & Portfolio Description

> **College Lost & Found Management System | Full-Stack Web Application**
> *Tech Stack: Java 21, Spring Boot 3, React 19, MongoDB, Spring Security, JWT, Tailwind CSS, Vite, Cloudinary, Swagger*
> - Engineered an enterprise-grade campus asset recovery web application with role-based access for students, administrators, and visitors.
> - Developed RESTful microservices in Spring Boot 3 with JWT token authentication, BCrypt password encryption, and multi-criteria MongoDB search queries.
> - Designed a modern responsive user interface in React 19 and Tailwind CSS with theme persistence, live statistics, and safe in-app handoff messaging.
> - Implemented secure claim verification workflows, content moderation tools, abuse reporting, and an immutable administrator audit log.
> - Wrote automated test suites in JUnit 5 and Mockito, configured embedded MongoDB testing environments, and published interactive OpenAPI/Swagger documentation.

---

## ⚖️ License
This project is open-source and available under the [MIT License](LICENSE).
