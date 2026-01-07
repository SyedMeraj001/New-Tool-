<p align="center">
  <img src="frontend/src/companyLogo.jpg" alt="ESGenius Tech Logo" width="120" height="120" style="border-radius: 50%;">
</p>

<h1 align="center">🌿 ESGenius Tech - ESG Dashboard</h1>

<p align="center">
  <strong>Enterprise-grade Environmental, Social & Governance (ESG) Management Platform</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0.0-green.svg" alt="Version">
  <img src="https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg" alt="Node">
  <img src="https://img.shields.io/badge/PostgreSQL-18-blue.svg" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/React-18-61dafb.svg" alt="React">
  <img src="https://img.shields.io/badge/ES%20Modules-enabled-yellow.svg" alt="ES Modules">
  <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License">
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-installation">Installation</a> •
  <a href="#-api-reference">API</a> •
  <a href="#-security">Security</a> •
  <a href="#-team">Team</a>
</p>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation Guide](#-installation-guide)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Project Structure](#-project-structure)
- [API Reference](#-api-reference)
- [Security Features](#-security-features)
- [User Accounts](#-user-accounts)
- [Team & Contributors](#-team--contributors)

---

## ✨ Features

### 🎯 Core Modules

| Module | Description |
|--------|-------------|
| 📊 **Analytics Dashboard** | Real-time ESG KPIs, trends, benchmarking, risk assessment |
| ✅ **4-Level Approval Workflow** | Site → Business Unit → Group ESG → Executive approval chain |
| 📝 **ESG Data Entry** | Environmental, Social, Governance data collection with validation |
| 📄 **Compliance Management** | Document upload, tracking, regulatory compliance |
| 📈 **Reports & KPIs** | Framework-compliant reports (GRI, SASB, TCFD, CSRD) |
| 👥 **User Management** | Role-based access (Super Admin, Supervisor, Data Entry) |
| 🔐 **Secure Sessions** | Database-backed sessions replacing localStorage |

### 🔥 Key Highlights

- ✅ **ES Modules** - Modern JavaScript with `import/export`
- ✅ **PostgreSQL Database** - Enterprise-grade data storage
- ✅ **JWT + HTTP-only Cookies** - Secure authentication
- ✅ **Real-time Notifications** - Approval workflow alerts
- ✅ **Audit Logging** - Blockchain-style hash chain for compliance
- ✅ **Multi-Framework Support** - GRI, SASB, TCFD, CSRD, BRSR

---

## 🛠 Tech Stack


| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Tailwind CSS, React Router, AuthContext |
| **Backend** | Node.js 22, Express.js, ES Modules |
| **Database** | PostgreSQL 18, Sequelize ORM |
| **Authentication** | JWT (HTTP-only cookies), bcrypt (12 rounds), Database Sessions |
| **File Upload** | Multer, XLSX parsing |
| **Security** | CORS, cookie-parser, No localStorage |

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/SyedMeraj001/New-Tool-.git
cd New-Tool-

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Setup database (PostgreSQL must be running)
# Create database: new_tool_db

# Configure environment
cp backend/.env.example backend/.env
# Edit .env with your database credentials

# Start the application
cd backend && npm start    # Backend: http://localhost:5000
cd frontend && npm start   # Frontend: http://localhost:3000
```

---

## 📦 Installation Guide

### Prerequisites

Before you begin, ensure you have the following installed:

| Software | Version | Download |
|----------|---------|----------|
| **Node.js** | ≥ 18.0.0 | [nodejs.org](https://nodejs.org/) |
| **PostgreSQL** | ≥ 15 | [postgresql.org](https://www.postgresql.org/download/) |
| **Git** | Latest | [git-scm.com](https://git-scm.com/) |
| **npm** | ≥ 9.0.0 | Comes with Node.js |

### Database Setup

#### Step 1: Install PostgreSQL

**Windows:**
```bash
# Download from https://www.postgresql.org/download/windows/
# Run installer, remember your password for 'postgres' user
# Default port: 5432
```

**macOS:**
```bash
brew install postgresql@18
brew services start postgresql@18
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Step 2: Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE new_tool_db;

# Connect to database
\c new_tool_db

# Exit
\q
```

#### Step 3: Run Database Schema

```bash
# Option 1: Using psql
psql -U postgres -d new_tool_db -f db/new_tool_db_schema.sql

# Option 2: Using pgAdmin
# Open pgAdmin → Connect to server → Right-click new_tool_db → Query Tool
# Open and run db/new_tool_db_schema.sql
```

#### Step 4: Verify Tables

```sql
-- Connect and check tables
psql -U postgres -d new_tool_db

-- List all tables
\dt

-- Expected tables:
-- users, companies, esg_data, approval_workflows, approval_steps,
-- audit_logs, notifications, user_sessions, user_preferences,
-- validation_results, safety_compliance, environmental_data,
-- social_data, governance_data, compliance_documents
```

### Backend Setup

#### Step 1: Navigate to Backend

```bash
cd backend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Configure Environment

Create `.env` file in `backend/` directory:

```env
# ================================
# Server Configuration
# ================================
PORT=5000
NODE_ENV=development

# ================================
# PostgreSQL Database
# ================================
DB_HOST=localhost
DB_PORT=5432
DB_NAME=new_tool_db
DB_USER=postgres
DB_PASSWORD=your_password_here

# ================================
# Security
# ================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# ================================
# Frontend URL (for CORS)
# ================================
FRONTEND_URL=http://localhost:3000
```

#### Step 4: Start Backend Server

```bash
# Development mode
npm start

# Or with nodemon (auto-restart)
npm run dev
```

**Expected Output:**
```
Server running on port 5000
Database connected
Models synchronized
```

#### Step 5: Verify Backend

```bash
# Test API
curl http://localhost:5000/

# Expected response:
{
  "message": "ESG Dashboard API",
  "version": "2.0.0",
  "status": "healthy"
}
```

### Frontend Setup

#### Step 1: Navigate to Frontend

```bash
cd frontend
```

#### Step 2: Install Dependencies

```bash
npm install
```

#### Step 3: Configure Environment (Optional)

Create `.env` file in `frontend/` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

#### Step 4: Start Frontend

```bash
npm start
```

**Frontend will open at:** `http://localhost:3000`

---

## 📁 Project Structure

```
New-Tool-/
├── 📂 backend/
│   ├── 📂 config/
│   │   ├── database.js          # Sequelize config
│   │   └── db.js                # Database connection
│   ├── 📂 controllers/
│   │   ├── companyController.js
│   │   ├── environmentalController.js
│   │   ├── socialController.js
│   │   ├── governanceController.js
│   │   └── uploadController.js
│   ├── 📂 middleware/
│   │   ├── cors.js              # CORS configuration
│   │   ├── errorHandler.js      # Global error handler
│   │   └── authMiddleware.js    # JWT verification
│   ├── 📂 models/
│   │   ├── index.js             # Sequelize models (Venkat)
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Environmental.js
│   │   ├── Social.js
│   │   └── Governance.js
│   ├── 📂 routes/
│   │   ├── analyticsRoutes.js   # Analytics API (Venkat)
│   │   ├── workflowRoutes.js    # Approval workflow (Venkat)
│   │   ├── authRoutes.js        # Authentication (Venkat)
│   │   ├── sessionRoutes.js     # Secure sessions (Venkat)
│   │   ├── companyRoutes.js     # Company CRUD (Team)
│   │   ├── compliance.js        # Compliance docs (Revathi)
│   │   └── auth.js              # Team auth (PT)
│   ├── 📂 services/
│   │   └── workflowService.js   # Workflow business logic
│   ├── 📂 uploads/              # File uploads
│   ├── .env                     # Environment variables
│   ├── package.json
│   └── server.js                # Main entry point
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 components/
│   │   │   ├── WorkflowDashboard.js
│   │   │   └── ProfessionalHeader.js
│   │   ├── 📂 services/
│   │   │   ├── apiService.js
│   │   │   └── secureStorage.js  # Secure storage (Venkat)
│   │   ├── 📂 contexts/
│   │   │   └── ThemeContext.js
│   │   ├── Analytics.js
│   │   ├── Dashboard.js
│   │   ├── DataEntry.js
│   │   ├── Login.jsx
│   │   └── App.js
│   └── package.json
│
├── 📂 db/
│   ├── new_tool_db_schema.sql   # Database schema
│   └── TEAM_SETUP.md            # Team setup guide
│
├── 📂 docs/
│   ├── ANALYTICS_APPROVAL_MODULES.md
│   └── PROJECT_STRUCTURE.md
│
└── README.md
```

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```


### Authentication APIs (Secure - January 2026)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/login` | Secure login with bcrypt | ❌ |
| `POST` | `/auth/register` | Register with hashed password | ❌ |
| `GET` | `/auth/me` | Get current user from cookie | ✅ |
| `POST` | `/auth/logout` | Logout & invalidate session | ✅ |
| `GET` | `/auth/users` | List all users (admin) | ✅ |
| `POST` | `/auth/change-password` | Change password | ✅ |
| `PATCH` | `/auth/users/:id/activate` | Activate/deactivate user | ✅ |

**Secure Login Example:**
```bash
# Login - sets HTTP-only cookie automatically
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{"email": "superadmin1@esgenius.com", "password": "Admin@2025", "role": "super_admin"}'

# Response:
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "email": "superadmin1@esgenius.com",
    "fullName": "Super Admin 1",
    "role": "super_admin"
  }
}

# Subsequent requests - cookie sent automatically
curl http://localhost:5000/api/auth/me \
  -b cookies.txt

# Response:
{
  "success": true,
  "user": {
    "id": 1,
    "email": "superadmin1@esgenius.com",
    "fullName": "Super Admin 1",
    "role": "super_admin"
  }
}
```

**Change Password:**
```bash
curl -X POST http://localhost:5000/api/auth/change-password \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"currentPassword": "Admin@2025", "newPassword": "NewSecure@2026"}'
```

### Analytics APIs (Venkat)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/analytics/summary` | Overall summary |
| `GET` | `/analytics/kpis` | ESG KPI scores |
| `GET` | `/analytics/category-distribution` | Category breakdown |
| `GET` | `/analytics/trends` | Monthly trends |
| `GET` | `/analytics/insights` | AI-powered insights |
| `GET` | `/analytics/benchmarking` | Industry comparison |
| `GET` | `/analytics/risk-assessment` | Risk analysis |

**KPIs Example:**
```bash
curl http://localhost:5000/api/analytics/kpis

# Response:
{
  "success": true,
  "data": {
    "overall_score": 80,
    "environmental_score": 72,
    "social_score": 82,
    "governance_score": 87,
    "total_entries": 22,
    "compliance_rate": 94
  }
}
```

### Workflow APIs (Venkat)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/workflows` | List all workflows |
| `GET` | `/workflows/:id` | Get workflow by ID |
| `POST` | `/workflows` | Create new workflow |
| `POST` | `/workflows/:id/approve` | Approve workflow step |
| `POST` | `/workflows/:id/reject` | Reject workflow step |
| `GET` | `/workflows/audit/logs` | Get audit logs |
| `GET` | `/workflows/notifications/:userId` | Get notifications |

**4-Level Approval Flow:**
```
Level 1: SITE → Level 2: BUSINESS_UNIT → Level 3: GROUP_ESG → Level 4: EXECUTIVE
```

### Session APIs (Venkat - Security)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/session/create` | Create secure session |
| `GET` | `/session/validate/:token` | Validate session |
| `POST` | `/session/logout` | Invalidate session |
| `GET` | `/session/preferences/:email` | Get user preferences |
| `PUT` | `/session/preferences/:email` | Update preferences |
| `POST` | `/session/validation` | Save validation result |
| `GET` | `/session/safety/:userId` | Get safety data |

### ESG Data APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/esg/data` | Get all ESG data |
| `POST` | `/esg/data` | Create ESG entry |
| `GET` | `/esg/scores/:userId` | Get ESG scores |
| `GET` | `/esg/kpis/:userId` | Get KPIs |

### Company APIs (Team)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/company` | List all companies |
| `POST` | `/company` | Create/update company |
| `GET` | `/company/year/:year` | Get by reporting year |

### Compliance APIs (Revathi)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/compliance` | List documents |
| `POST` | `/compliance/upload` | Upload document |
| `GET` | `/compliance/preview/:filename` | Preview file |
| `DELETE` | `/compliance/:id` | Delete document |
| `PATCH` | `/compliance/:id/status` | Update status |

---

## 🔐 Security Features

### 🔒 Authentication & Authorization (NEW - January 2026)

| Feature | Implementation | Status |
|---------|----------------|--------|
| **Password Hashing** | bcrypt with 12 salt rounds | ✅ Secure |
| **JWT Tokens** | HTTP-only cookies, 24h expiry | ✅ Secure |
| **Session Management** | Database-backed sessions | ✅ Secure |
| **No localStorage** | All auth via cookies only | ✅ Secure |
| **Role-Based Access** | Super Admin, Supervisor, Data Entry | ✅ Active |
| **Auto Password Migration** | Plain text → bcrypt on first login | ✅ Active |

### 🛡️ Security Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    SECURE AUTHENTICATION FLOW                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. LOGIN REQUEST                                                │
│     ┌──────────┐    POST /api/auth/login    ┌──────────────┐   │
│     │ Frontend │ ─────────────────────────► │   Backend    │   │
│     │ (React)  │    {email, password, role} │  (Express)   │   │
│     └──────────┘                            └──────────────┘   │
│                                                     │           │
│  2. PASSWORD VERIFICATION                           ▼           │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  bcrypt.compare(password, hashedPassword)            │   │
│     │  ✅ 12 salt rounds for maximum security              │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                     │           │
│  3. SESSION CREATION                                ▼           │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  INSERT INTO user_sessions (token, userId, expiresAt)│   │
│     │  ✅ Sessions stored in PostgreSQL database           │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                     │           │
│  4. JWT COOKIE SET                                  ▼           │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  Set-Cookie: token=JWT; HttpOnly; Secure; SameSite   │   │
│     │  ✅ NOT accessible via JavaScript (XSS protected)    │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                  │
│  5. SUBSEQUENT REQUESTS                                          │
│     ┌──────────┐    Cookie: token=JWT       ┌──────────────┐   │
│     │ Frontend │ ─────────────────────────► │   Backend    │   │
│     │          │    (auto-sent by browser)  │              │   │
│     └──────────┘                            └──────────────┘   │
│                                                     │           │
│  6. SESSION VALIDATION                              ▼           │
│     ┌──────────────────────────────────────────────────────┐   │
│     │  SELECT * FROM user_sessions WHERE token = $1        │   │
│     │  AND isActive = true AND expiresAt > NOW()           │   │
│     └──────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### ❌ OLD vs ✅ NEW Security

| Aspect | ❌ OLD (Insecure) | ✅ NEW (Secure) |
|--------|-------------------|-----------------|
| **Password Storage** | Plain text in database | bcrypt hashed (12 rounds) |
| **Token Storage** | localStorage (XSS vulnerable) | HTTP-only cookie |
| **Session Validation** | Client-side only | Server-side database check |
| **User Data** | Stored in browser | Fetched from server on each request |
| **Logout** | Clear localStorage | Invalidate session in database |

### 🔐 Cookie Security Settings

```javascript
// HTTP-only cookie configuration
res.cookie('token', jwtToken, {
  httpOnly: true,      // ✅ Not accessible via JavaScript
  secure: true,        // ✅ HTTPS only in production
  sameSite: 'lax',     // ✅ CSRF protection
  maxAge: 86400000,    // ✅ 24 hour expiry
  path: '/'            // ✅ Available on all routes
});
```

### Data Security

| Feature | Description |
|---------|-------------|
| **Secure Sessions** | Sessions stored in PostgreSQL `user_sessions` table |
| **CORS Protection** | Configured for frontend origin only with credentials |
| **Input Validation** | Server-side validation on all inputs |
| **SQL Injection Prevention** | Parameterized queries via Sequelize |
| **Audit Logging** | Blockchain-style hash chain for compliance |

### Database Tables for Security

```sql
-- Secure user sessions (replaces localStorage)
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  "userId" VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  "expiresAt" TIMESTAMP NOT NULL,
  "ipAddress" VARCHAR(50),
  "isActive" BOOLEAN DEFAULT true,
  "createdAt" TIMESTAMP DEFAULT NOW(),
  "updatedAt" TIMESTAMP DEFAULT NOW()
);

-- Users with hashed passwords
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,  -- bcrypt hashed
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Environment Variables (Security)

```env
# ⚠️ NEVER commit these to Git!
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
DB_PASSWORD=your-database-password

# Production settings
NODE_ENV=production  # Enables secure cookies
```

### Password Requirements

- Passwords are hashed using bcrypt with 12 salt rounds
- Auto-migration: Plain text passwords are automatically hashed on first login
- New registrations always use hashed passwords
- Change password endpoint available at `/api/auth/change-password`

---

## 👤 User Accounts

### Pre-configured Test Accounts (48 Total)

#### 🔴 Super Admin Accounts (3)

| # | Email | Password | Full Name |
|---|-------|----------|-----------|
| 1 | `superadmin1@esgenius.com` | `Admin@2025` | Super Admin 1 |
| 2 | `superadmin2@esgenius.com` | `Admin@2025` | Super Admin 2 |
| 3 | `superadmin3@esgenius.com` | `Admin@2025` | Super Admin 3 |

#### 🔵 Supervisor Accounts (15)

| # | Email | Password | Full Name |
|---|-------|----------|-----------|
| 1 | `supervisor1@esgenius.com` | `Super@2025` | Supervisor 1 |
| 2 | `supervisor2@esgenius.com` | `Super@2025` | Supervisor 2 |
| 3 | `supervisor3@esgenius.com` | `Super@2025` | Supervisor 3 |
| 4 | `supervisor4@esgenius.com` | `Super@2025` | Supervisor 4 |
| 5 | `supervisor5@esgenius.com` | `Super@2025` | Supervisor 5 |
| 6 | `supervisor6@esgenius.com` | `Super@2025` | Supervisor 6 |
| 7 | `supervisor7@esgenius.com` | `Super@2025` | Supervisor 7 |
| 8 | `supervisor8@esgenius.com` | `Super@2025` | Supervisor 8 |
| 9 | `supervisor9@esgenius.com` | `Super@2025` | Supervisor 9 |
| 10 | `supervisor10@esgenius.com` | `Super@2025` | Supervisor 10 |
| 11 | `supervisor11@esgenius.com` | `Super@2025` | Supervisor 11 |
| 12 | `supervisor12@esgenius.com` | `Super@2025` | Supervisor 12 |
| 13 | `supervisor13@esgenius.com` | `Super@2025` | Supervisor 13 |
| 14 | `supervisor14@esgenius.com` | `Super@2025` | Supervisor 14 |
| 15 | `supervisor15@esgenius.com` | `Super@2025` | Supervisor 15 |

#### 🟢 Data Entry Accounts (30)

| # | Email | Password | Full Name |
|---|-------|----------|-----------|
| 1 | `dataentry1@esgenius.com` | `Data@2025` | Data Entry User 1 |
| 2 | `dataentry2@esgenius.com` | `Data@2025` | Data Entry User 2 |
| 3 | `dataentry3@esgenius.com` | `Data@2025` | Data Entry User 3 |
| 4 | `dataentry4@esgenius.com` | `Data@2025` | Data Entry User 4 |
| 5 | `dataentry5@esgenius.com` | `Data@2025` | Data Entry User 5 |
| 6 | `dataentry6@esgenius.com` | `Data@2025` | Data Entry User 6 |
| 7 | `dataentry7@esgenius.com` | `Data@2025` | Data Entry User 7 |
| 8 | `dataentry8@esgenius.com` | `Data@2025` | Data Entry User 8 |
| 9 | `dataentry9@esgenius.com` | `Data@2025` | Data Entry User 9 |
| 10 | `dataentry10@esgenius.com` | `Data@2025` | Data Entry User 10 |
| 11 | `dataentry11@esgenius.com` | `Data@2025` | Data Entry User 11 |
| 12 | `dataentry12@esgenius.com` | `Data@2025` | Data Entry User 12 |
| 13 | `dataentry13@esgenius.com` | `Data@2025` | Data Entry User 13 |
| 14 | `dataentry14@esgenius.com` | `Data@2025` | Data Entry User 14 |
| 15 | `dataentry15@esgenius.com` | `Data@2025` | Data Entry User 15 |
| 16 | `dataentry16@esgenius.com` | `Data@2025` | Data Entry User 16 |
| 17 | `dataentry17@esgenius.com` | `Data@2025` | Data Entry User 17 |
| 18 | `dataentry18@esgenius.com` | `Data@2025` | Data Entry User 18 |
| 19 | `dataentry19@esgenius.com` | `Data@2025` | Data Entry User 19 |
| 20 | `dataentry20@esgenius.com` | `Data@2025` | Data Entry User 20 |
| 21 | `dataentry21@esgenius.com` | `Data@2025` | Data Entry User 21 |
| 22 | `dataentry22@esgenius.com` | `Data@2025` | Data Entry User 22 |
| 23 | `dataentry23@esgenius.com` | `Data@2025` | Data Entry User 23 |
| 24 | `dataentry24@esgenius.com` | `Data@2025` | Data Entry User 24 |
| 25 | `dataentry25@esgenius.com` | `Data@2025` | Data Entry User 25 |
| 26 | `dataentry26@esgenius.com` | `Data@2025` | Data Entry User 26 |
| 27 | `dataentry27@esgenius.com` | `Data@2025` | Data Entry User 27 |
| 28 | `dataentry28@esgenius.com` | `Data@2025` | Data Entry User 28 |
| 29 | `dataentry29@esgenius.com` | `Data@2025` | Data Entry User 29 |
| 30 | `dataentry30@esgenius.com` | `Data@2025` | Data Entry User 30 |

### Quick Login Reference

| Role | Email Pattern | Password |
|------|---------------|----------|
| 🔴 Super Admin | `superadmin[1-3]@esgenius.com` | `Admin@2025` |
| 🔵 Supervisor | `supervisor[1-15]@esgenius.com` | `Super@2025` |
| 🟢 Data Entry | `dataentry[1-30]@esgenius.com` | `Data@2025` |

### Login Steps

1. Open `http://localhost:3000`
2. Enter email (e.g., `superadmin1@esgenius.com`)
3. Enter password (e.g., `Admin@2025`)
4. Select role from dropdown (must match account role)
5. Click **Login**

### pgAdmin Login Query

```sql
-- View all users with passwords (hashed)
SELECT id, email, full_name, role, is_active, created_at 
FROM users 
ORDER BY role, id;

-- Count users by role
SELECT role, COUNT(*) as count 
FROM users 
GROUP BY role;
```

**Total: 48 users** (3 Super Admin + 15 Supervisor + 30 Data Entry)

### Role Permissions

| Permission | Super Admin | Supervisor | Data Entry |
|------------|:-----------:|:----------:|:----------:|
| View Dashboard | ✅ | ✅ | ✅ |
| Enter ESG Data | ✅ | ✅ | ✅ |
| Approve Level 1-2 | ✅ | ✅ | ❌ |
| Approve Level 3-4 | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| View All Notifications | ✅ | ✅ | ❌ |
| Generate Reports | ✅ | ✅ | ❌ |

---

## 🗄 Database Schema

### Core Tables

```sql
-- Users (48 pre-configured)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,  -- super_admin, supervisor, data_entry
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ESG Data
CREATE TABLE esg_data (
  id SERIAL PRIMARY KEY,
  company_id INTEGER,
  category VARCHAR(50),  -- environmental, social, governance
  metric_name VARCHAR(255),
  metric_value DECIMAL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Approval Workflows
CREATE TABLE approval_workflows (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  submitted_by VARCHAR(255),
  status VARCHAR(50) DEFAULT 'pending',
  current_level INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Secure Sessions (Venkat)
CREATE TABLE user_sessions (
  id UUID PRIMARY KEY,
  user_id VARCHAR(255),
  email VARCHAR(255),
  token VARCHAR(128) UNIQUE,
  expires_at TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

---

## 👥 Team & Contributors

<table>
  <tr>
    <td align="center">
      <strong>Venkatareddy26</strong><br>
      <sub>Developer</sub><br>
      <sub>Analytics, Workflows, Security</sub>
    </td>
    <td align="center">
      <strong>Revathi</strong><br>
      <sub>Developer</sub><br>
      <sub>Compliance Module</sub>
    </td>
    <td align="center">
      <strong>PT</strong><br>
      <sub>Developer</sub><br>
      <sub>Authentication</sub>
    </td>
    <td align="center">
      <strong>Shalini</strong><br>
      <sub>Developer</sub><br>
      <sub>ESG Data Entry</sub>
    </td>
  </tr>
</table>

### Contribution Summary

| Contributor | Modules |
|-------------|---------|
| **Venkatareddy26** | Analytics (7 APIs), 4-Level Approval Workflow, Secure Sessions, ES Modules Conversion, Database Auth |
| **Revathi** | Compliance Documents, File Upload/Preview |
| **PT** | Login/Register with Cookies, User Approval |
| **Shalini** | Company, Environmental, Social, Governance Data Entry |

---

## 📝 Scripts

### Backend

```bash
cd backend

npm start        # Start server
npm run dev      # Start with nodemon
npm test         # Run tests
```

### Frontend

```bash
cd frontend

npm start        # Start development server
npm run build    # Production build
npm test         # Run tests
```

### Database

```bash
# Create database
psql -U postgres -c "CREATE DATABASE new_tool_db;"

# Run schema
psql -U postgres -d new_tool_db -f db/new_tool_db_schema.sql

# Check tables
psql -U postgres -d new_tool_db -c "\dt"
```

---

## 🐛 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ECONNREFUSED` | Ensure PostgreSQL is running |
| `relation does not exist` | Run database schema script |
| `Module not found` | Run `npm install` in both folders |
| `CORS error` | Check `FRONTEND_URL` in `.env` |
| `JWT malformed` | Clear cookies and login again |

### Database Connection

```bash
# Test PostgreSQL connection
psql -U postgres -d new_tool_db -c "SELECT 1;"

# Check if tables exist
psql -U postgres -d new_tool_db -c "\dt"
```

---

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  Made with 💚 by <strong>ESGenius Tech Team</strong>
</p>

<p align="center">
  <a href="https://github.com/SyedMeraj001/New-Tool-">⭐ Star this repo</a> •
  <a href="https://github.com/SyedMeraj001/New-Tool-/issues">🐛 Report Bug</a> •
  <a href="https://github.com/SyedMeraj001/New-Tool-/pulls">✨ Request Feature</a>
</p>
