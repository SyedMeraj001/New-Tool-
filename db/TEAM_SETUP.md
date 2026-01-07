# Database Setup Guide

## ⚠️ IMPORTANT: Use Team Database

**DO NOT create a new database.** Use the existing team database schema.

---

## 📁 Files

| File | Description |
|------|-------------|
| `new_tool_db_schema.sql` | Team's database schema (companies table) |

---

## 🗄️ Database Tables

### `companies` Table (Team Schema)
```sql
CREATE TABLE companies (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    reporting_year INT NOT NULL,
    sector VARCHAR(150),
    region VARCHAR(150),
    primary_reporting_framework VARCHAR(255) NOT NULL,
    assurance_level VARCHAR(100),
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🟢 Setup Steps

### Step 1: Pull Latest Code
```bash
git pull origin main
```

### Step 2: Create Database (if not exists)
```bash
psql -U postgres
CREATE DATABASE new_tool_db;
\q
```

### Step 3: Import Schema
```bash
psql -U postgres -d new_tool_db < db/new_tool_db_schema.sql
```

### Step 4: Verify
```bash
psql -U postgres -d new_tool_db
\dt
```

### Step 5: Configure Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your DB_PASSWORD
```

### Step 6: Start
```bash
npm run install:all
npm start
```

---

## 🔧 Troubleshooting

### "database already exists"
That's fine - just import the schema.

### "table already exists"
Schema will update existing tables.

### "permission denied"
Run terminal as Administrator.
