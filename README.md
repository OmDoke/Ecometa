# ♻️ Ecometa: The Intelligent E-Waste Circular Economy

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Spring%20Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" />
  <img src="https://img.shields.io/badge/MongoDB%20Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
  <img src="https://img.shields.io/badge/WebSockets-010101?style=for-the-badge&logo=socketdotio&logoColor=white" />
</p>

<p align="center">
  <a href="https://ecometa.onrender.com/"><b>🔗 Live Demo</b></a>
</p>

**Ecometa** is a professional e-waste management platform designed to bridge the gap between individual generators and certified recycling centers. By providing a transparent, traceable, and rewarding ecosystem, Ecometa ensures that hazardous electronic waste is disposed of responsibly.

> ⚠️ **Note:** The live demo runs on Render's free tier — the backend may take 30–60 seconds to spin up on first load.

---

## 🏗️ Technical Architecture

Ecometa follows a modern decoupled architecture designed for high throughput and real-time responsiveness:

- **Frontend**: React.js SPA (Single Page Application) styled with **Vanilla CSS** and **React-Bootstrap**. Animations powered by **Framer Motion**.
- **Backend**: Spring Boot 3.2.4 REST API using **Service-Oriented Architecture (SOA)**.
- **Real-Time Layer**: **WebSockets (STOMP/SockJS)** for instant bidirectional communication. This ensures users receive immediate notifications when a Recycler accepts a pickup or when an automated Recycling Certificate is processed.
- **Database**: **MongoDB Atlas** (NoSQL) for flexible data modeling and scalable document storage.
- **Security**: **Spring Security** with custom **JWT (JSON Web Token)** implementation for stateless, secure authentication.

---

## 🔐 Security Framework

The platform implements enterprise-standard security measures:

1. **JWT Authentication** — all requests are authenticated via a `Bearer <token>` header. Tokens are signed with HS256 using a server-side secret.
2. **Stateless Sessions** — the backend does not store session state; all identity information is extracted securely from the JWT claims.
3. **Role-Based Access Control (RBAC)** — distinct permissions for `USER` and `RECYCLER` roles.
4. **Secure Principal Extraction** — critical operations (like submitting waste or accepting pickups) extract the `UserID` directly from the secure `SecurityContext`, preventing "ID Spoofing" attacks.
5. **BCrypt Hashing** — all passwords are salted and hashed with a cost factor of 12.

---

## 📊 E-Waste Lifecycle (State Machine)

The platform enforces a strict, resilient lifecycle to ensure data integrity and auditability across all stages of the circular economy:

1. **`SUBMITTED`** — initial state; item is broadcast to the Recycler network
2. **`CANCELLED`** — user-triggered abort before a recycler accepts the request
3. **`ACCEPTED`** — recycler claims the item; coordination for physical pickup begins
4. **`FAILED_PICKUP`** — handled edge case where the recycler cannot locate the item or user is absent; request returns to the active queue
5. **`COLLECTED`** — physical verification complete; status change triggers automated Certificate generation
6. **`RECYCLED`** — processing complete; terminal state for the physical item
7. **`REWARD_ISSUED`** — automated event following recycling; **EcoPoints** are allocated to the user account as a financial incentive for participation

---

## 🛠️ Developer Setup Guide

### 1. Prerequisites

- **Java 17+** & Maven 3.8+
- **Node.js 18+** & npm
- **MongoDB Atlas** Cluster (with a created database named `ecometa`)

### 2. Environment Variables

Create a local `.env` file or set these in your environment:

| Variable | Description | Example |
|---|---|---|
| `MONGODB_URI` | Full connection string to Atlas | `mongodb+srv://...` |
| `JWT_SECRET` | Base64 or plain string for signing | `U2VjdXJlS2V5...` |
| `GMAIL_USER` | Email for SMTP notifications | `alerts@ecometa.app` |
| `GMAIL_PASS` | **Google App Password** (not account password) | `abcd efgh ijkl mnop` |
| `FRONTEND_URL` | For CORS configurations | `http://localhost:3000` |

### 3. Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

API runs at `http://localhost:8080`.

### 4. Frontend Setup

```bash
cd frontend
npm install
npm start
```

UI runs at `http://localhost:3000`.

---

## 📁 Repository Structure

```
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
└── frontend/
    ├── src/
    │   ├── components/   # Real-time Dashboard, Map, Forms
    │   ├── App.js        # Protected Routing
    │   └── index.css     # Design System & Premium UI tokens
    └── package.json
```

---

## 📜 Contribution Rules

- **Maintain Separation** — business logic stays in `@Service`, never in `@RestController`
- **Secure by Default** — always use `Principal` or `SecurityContextHolder` to fetch the logged-in user in services
- **Standard Responses** — all API endpoints must return `ResponseEntity`

---

## 👤 Author

**Om Doke**
- GitHub: [@OmDoke](https://github.com/OmDoke)
- LinkedIn: [onkar-doke](https://www.linkedin.com/in/onkar-doke-26862420a/)

---

Developed with ❤️ by the **Ecometa Engineering Team**.

⭐️ If you found this project interesting, consider giving it a star!
