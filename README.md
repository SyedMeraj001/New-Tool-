# 🌿 ESGenius Tech - ESG Dashboard

Enterprise-grade Environmental, Social & Governance (ESG) Management Platform

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/SyedMeraj001/New-Tool-.git
cd New-Tool-

# Install
cd backend && npm install
cd ../frontend && npm install

# Configure
cp backend/.env.example backend/.env
# Edit .env with your database credentials

# Start
cd backend && npm start    # http://localhost:5000
cd frontend && npm start   # http://localhost:3000
```

## 🔐 Login Credentials

| Role | Email | Password |
|------|-------|----------|
| 🔴 Super Admin | `superadmin1@esgenius.com` | `Admin@123` |
| � Supervisor | `supervisor1@esgenius.com` | `Super@123` |
| 🟢 Data Entry | `dataentry1@esgenius.com` | `Data@123` |

**Pattern:** `superadmin[1-3]`, `supervisor[1-15]`, `dataentry[1-30]`

### Reset Password
```bash
node backend/reset-password.js
```

## 🛠 Tech Stack

- **Frontend:** React 18, Tailwind CSS
- **Backend:** Node.js, Express.js, ES Modules
- **Database:** PostgreSQL 18, Sequelize ORM
- **Auth:** JWT (HTTP-only cookies), bcrypt

## 📁 Project Structure

```
New-Tool-/
├── backend/
│   ├── routes/          # API endpoints
│   ├── models/          # Sequelize models
│   ├── services/        # Business logic
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # Auth, Theme contexts
│   │   └── services/    # API services
│   └── package.json
└── db/
    └── new_tool_db_schema.sql
```

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/register` | Register |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/logout` | Logout |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Dashboard summary |
| GET | `/api/analytics/kpis` | ESG KPI scores |
| GET | `/api/analytics/trends` | Monthly trends |

### Workflows
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/workflows` | List workflows |
| POST | `/api/workflows` | Create workflow |
| POST | `/api/workflows/:id/approve` | Approve step |

## 🗄 Database Setup

```bash
# Create database
psql -U postgres -c "CREATE DATABASE new_tool_db;"

# Import schema
psql -U postgres -d new_tool_db -f db/new_tool_db_schema.sql
```

## ⚙️ Environment Variables

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=new_tool_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

## � Team

| Name | Role |
|------|------|
| Venkatareddy26 | Analytics, Workflows, Security |
| Revathi | Compliance Module |
| PT | Authentication |
| Shalini | ESG Data Entry |

## 📄 License

MIT License
