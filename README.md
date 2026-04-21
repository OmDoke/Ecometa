# ♻️ Ecometa: The Intelligent E-Waste Circular Economy

**Ecometa** is a professional e-waste management platform designed to bridge the gap between individual generators and certified recycling centers. By providing a transparent, traceable, and rewarding ecosystem, Ecometa ensures that hazardous electronic waste is disposed of responsibly.

---

## 🏗️ Technical Architecture

Ecometa follows a modern decoupled architecture designed for high throughput and real-time responsiveness:

*   **Frontend**: React.js SPA (Single Page Application) styled with **Vanilla CSS** and **React-Bootstrap**. Animations powered by **Framer Motion**.
*   **Backend**: Spring Boot 3.2.4 REST API using **Service-Oriented Architecture (SOA)**.
*   **Real-Time Layer**: **WebSockets (STOMP/SockJS)** for instant bidirectional communication. This ensures users receive immediate notifications when a Recycler accepts a pickup or when an automated Recycling Certificate is processed.
*   **Database**: **MongoDB Atlas** (NoSQL) for flexible data modeling and scalable document storage.
*   **Security**: **Spring Security** with custom **JWT (JSON Web Token)** implementation for stateless, secure authentication.

---

## 🔐 Security Framework

The platform implements enterprise-standard security measures:
1.  **JWT Authentication**: All requests are authenticated via a `Bearer <token>` header. Tokens are signed with HS256 using a server-side secret.
2.  **Stateless Sessions**: The backend does not store session state; all identity information is extracted securely from the JWT claims.
3.  **Role-Based Access Control (RBAC)**: Distinct permissions for `USER` and `RECYCLER` roles.
4.  **Secure Principal Extraction**: Critical operations (like submitting waste or accepting pickups) extract the `UserID` directly from the secure `SecurityContext`, preventing "ID Spoofing" attacks.
5.  **BCrypt Hashing**: All passwords are salted and hashed with a cost factor of 12.

---

## 📊 E-Waste Lifecycle (State Machine)

The platform enforces a strict, resilient lifecycle to ensure data integrity and auditability across all stages of the circular economy:

1.  **`SUBMITTED`**: Initial state; item is broadcast to the Recycler network.
2.  **`CANCELLED`**: User-triggered abort before a recycler accepts the request.
3.  **`ACCEPTED`**: Recycler claims the item; coordination for physical pickup begins.
4.  **`FAILED_PICKUP`**: Handled edge case where the recycler cannot locate the item or user is absent; request returns to the active queue.
5.  **`COLLECTED`**: Physical verification complete. Status change triggers automated Certificate generation.
6.  **`RECYCLED`**: Processing complete; terminal state for the physical item.
7.  **`REWARD_ISSUED`**: Automated event following recycling; **EcoPoints** are allocated to the user account as a financial incentive for participation.

---

## 🛠️ Developer Setup Guide

### 1. Prerequisites
*   **Java 17+** & Maven 3.8+
*   **Node.js 18+** & npm
*   **MongoDB Atlas** Cluster (with a created database named `ecometa`)

### 2. Environment Variables
Create a local `.env` file or set these in your environment:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `MONGODB_URI` | Full connection string to Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | Base64 or plain string for signing | `U2VjdXJlS2V5...` |
| `GMAIL_USER` | Email for SMTP notifications | `alerts@ecometa.app` |
| `GMAIL_PASS` | **Google App Password** (Not account pass) | `abcd efgh ijkl mnop` |
| `FRONTEND_URL` | For CORS configurations | `http://localhost:3000` |

### 3. Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```
The API will be available at `http://localhost:8080`.

### 4. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The UI will be available at `http://localhost:3000`.

---

## 📁 Repository Structure

```text
Ecometa/
├── backend/
│   ├── src/main/java/com/app/ecometa/
│   │   ├── config/       # Security, JWT, WebSocket configurations
│   │   ├── controller/   # REST Endpoints
│   │   ├── dto/          # LoginRequest, LoginResponse, etc.
│   │   ├── entity/       # Mongo Collections (User, EwasteItem)
│   │   ├── enums/        # Role, Status, EwasteType
│   │   ├── exception/    # Custom Exceptions & Global Handler
│   │   ├── repository/   # Spring Data Repositories
│   │   └── service/      # Business Logic (User, Ewaste, Email, Certificate)
│   └── pom.xml
└── frontend/             # Corrected React Application directory
    ├── src/
    │   ├── components/   # Real-time Dashboard, Map, Forms
    │   ├── App.js        # Protected Routing
    │   └── index.css     # Design System & Premium UI tokens
    └── package.json
```

---

## 📜 Contribution Rules
*   **Maintain Separation**: Business logic stays in `@Service`, never in `@RestController`.
*   **Secure by Default**: Always use `Principal` or `SecurityContextHolder` to fetch the logged-in user in services.
*   **Standard Responses**: All API endpoints must return `ResponseEntity`.

---
Developed with ❤️ by the **Ecometa Engineering Team**.
