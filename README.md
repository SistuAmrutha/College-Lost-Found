# College Lost & Found Management System

A full-stack web application designed to help college students report, search, and recover lost belongings within their campus. The platform provides separate access for students, administrators, and visitors, with secure authentication and item management features.

## 🚀 Tech Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Lucide React

**Backend**
- Java 21
- Spring Boot 3.3.4
- Spring Security 6
- JWT Authentication
- Spring Data MongoDB
- Maven

**Database & Storage**
- MongoDB
- Cloudinary (image storage)

**Testing & Documentation**
- JUnit 5
- Mockito
- Swagger / OpenAPI

---

## ✨ Key Features

- **User Authentication:** Secure registration and login using JWT authentication and password hashing.
- **Role-Based Access Control:** Separate permissions and interfaces for students, administrators, and visitors.
- **Lost & Found Reporting:** Students can report lost and found items with descriptions, categories, images, and locations.
- **Smart Search & Filtering:** Search items using keywords, categories, campus buildings, dates, and item status.
- **Claim Verification:** Students can submit ownership claims with identifying details and supporting information.
- **In-App Messaging:** Communication between finders and claimants to coordinate item recovery.
- **Admin Dashboard:** Administrators can manage users, moderate item posts, and review disputes.
- **Dashboard Statistics:** Displays information about reported, lost, found, and returned items.
- **Responsive UI:** Mobile-friendly interface with light and dark themes.
- **Image Uploads:** Supports Cloudinary-based image storage.

---

## 🏗️ Project Architecture

The application follows a frontend-backend architecture.

- **Frontend:** React application responsible for the user interface and API communication.
- **Backend:** Spring Boot REST APIs responsible for authentication, business logic, and data processing.
- **Database:** MongoDB stores user accounts, item reports, claims, and messages.
- **Security:** Spring Security and JWT handle authentication and authorization.

---

## 📂 Project Structure

```text
college-lost-found/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   └── pom.xml
│
├── docs/
│   ├── API_DOCUMENTATION.md
│   ├── DATABASE_SCHEMA.md
│   └── SETUP_GUIDE.md
│
├── .gitignore
└── README.md
```

---

## ⚙️ Installation and Setup

### Prerequisites

Make sure you have installed:

1. Java JDK 21 or above
2. Maven 3.8+
3. Node.js and npm
4. MongoDB (local installation or MongoDB Atlas account)
5. Git

### 1. Clone the Repository

```bash
git clone https://github.com/SistuAmrutha/College-Lost-Found.git
cd College-Lost-Found
```

### 2. Configure the Backend

Navigate to the backend folder:

```bash
cd backend
```

Configure the required environment variables, including:

- MongoDB connection string
- JWT secret
- Cloudinary credentials (if using Cloudinary)

Use the provided `.env.example` and setup documentation as a reference. Do not commit actual secrets to GitHub.

Run backend tests:

```bash
mvn test
```

Start the Spring Boot application:

```bash
mvn spring-boot:run
```

Backend API:

```text
http://localhost:8080/api
```

Swagger documentation:

```text
http://localhost:8080/swagger-ui.html
```

### 3. Configure the Frontend

Open another terminal and navigate to the frontend folder:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Configure the backend API URL using the frontend environment configuration.

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🧪 Testing

The project includes backend unit tests using JUnit 5 and Mockito.

The documented test results include:

- Backend: 13 test cases passed.
- Frontend: Production build verified using Vite.

Run backend tests:

```bash
cd backend
mvn test
```

Build the frontend:

```bash
cd frontend
npm run build
```

---

## 📚 Documentation

Additional project documentation:

- [API Documentation](docs/API_DOCUMENTATION.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Setup Guide](docs/SETUP_GUIDE.md)

---

## 💡 Future Enhancements

- Email notifications for claim updates.
- Advanced item matching and recommendations.
- College email verification.
- Deployment with cloud hosting.
- Improved analytics and reporting.

---

## 👩‍💻 Author

**S. Amrutha**

GitHub: [SistuAmrutha](https://github.com/SistuAmrutha)

---

## 📄 License

This project is licensed under the MIT License.
