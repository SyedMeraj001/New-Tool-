# ESG Dashboard - Analytics & Approval Modules

## Team Presentation Document
**Developer:** Venkat  
**Date:** December 31, 2025  
**Version:** 2.0.0 (ES Modules)

---

# 📊 MODULE 1: ANALYTICS

## Overview
The Analytics module provides real-time ESG performance metrics, trends, and benchmarking data by querying the `esg_data` table in PostgreSQL. All backend routes use ES Modules (import/export).

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ANALYTICS MODULE FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────────────┐       ┌─────────────────────┐       ┌─────────────┐  │
│   │   FRONTEND       │ HTTP  │   BACKEND API       │  SQL  │  DATABASE   │  │
│   │  Analytics.js    │──────►│ analyticsRoutes.js  │──────►│  esg_data   │  │
│   │  apiService.js   │◄──────│ /api/analytics/*    │◄──────│  (22 rows)  │  │
│   └──────────────────┘ JSON  │ (ES Modules)        │Results└─────────────┘  │
│                              └─────────────────────┘                         │
│                                                                              │
│   Frontend calls APIService.getESGKPIs() → Backend /api/esg/kpis/:userId    │
│   Frontend calls APIService.getESGData() → Backend /api/esg/data/:userId    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## API Endpoints (7 Total)

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/analytics/kpis` | GET | ESG scores (Overall, E, S, G) + compliance rate | `{overall_score, environmental_score, social_score, governance_score}` |
| `/api/analytics/category-distribution` | GET | Count of entries per category | `{environmental: 10, social: 7, governance: 5}` |
| `/api/analytics/trends` | GET | Monthly submission trends | `[{month, entries}]` |
| `/api/analytics/summary` | GET | Total entries and companies | `{total_entries, total_companies}` |
| `/api/analytics/benchmarking` | GET | Company comparison data | `{companies, industry_average, your_position}` |
| `/api/analytics/risk-assessment` | GET | Risk level analysis | `{high: 1, medium: 2, low: 4, overall: "LOW"}` |
| `/api/analytics/insights` | GET | AI-generated insights | `[{type, title, message, priority}]` |

## Additional ESG Endpoints (Used by Analytics.js)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/esg/kpis/:userId` | GET | User-specific KPIs |
| `/api/esg/data/:userId` | GET | User's ESG data entries |

## Score Calculation Logic

```javascript
// File: backend/routes/analyticsRoutes.js (ES Modules)
import express from 'express';
import { sequelize } from '../models/index.js';

// 1. Query each category's average
Environmental = AVG(metricValue) WHERE category = 'environmental'
Social        = AVG(metricValue) WHERE category = 'social'
Governance    = AVG(metricValue) WHERE category = 'governance'

// 2. Calculate overall score
Overall = (Environmental + Social + Governance) / 3

// 3. Cap scores at 100
Score = Math.min(score, 100)
```

## Database Query Examples

```sql
-- KPIs: Get average scores by category
SELECT AVG("metricValue") as score 
FROM esg_data 
WHERE category = 'environmental';

-- Category Distribution
SELECT category, COUNT(*) as count 
FROM esg_data 
GROUP BY category;

-- Monthly Trends
SELECT DATE_TRUNC('month', "createdAt") as month, COUNT(*) as entries 
FROM esg_data 
GROUP BY DATE_TRUNC('month', "createdAt") 
ORDER BY month DESC;
```

## Current Data (Live from Database - December 31, 2025)

| Metric | Value |
|--------|-------|
| Overall ESG Score | 80 |
| Environmental Score | 72 |
| Social Score | 82 |
| Governance Score | 87 |
| Compliance Rate | 94% |
| Total Entries | 22 |

| Category | Count |
|----------|-------|
| Environmental | 10 |
| Social | 7 |
| Governance | 5 |

| Risk Level | Count |
|------------|-------|
| High | 1 |
| Medium | 2 |
| Low | 4 |
| Overall | LOW |

### Companies in Database
- Acme Corp (12 entries)
- TechGlobal Inc (6 entries)
- GreenMine Ltd (4 entries)

---

# ✅ MODULE 2: APPROVAL WORKFLOW

## Overview
The Approval module implements a 4-level hierarchical approval workflow with blockchain-style audit trail for ESG data submissions.

## 4-Level Workflow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        4-LEVEL APPROVAL WORKFLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Data Entry User Submits ESG Data                                           │
│          │                                                                   │
│          ▼                                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ LEVEL 1: SITE APPROVAL                                               │   │
│   │ Approver: Site Manager                                               │   │
│   │ Action: Verify data accuracy at site level                          │   │
│   └────────────────────────────────┬────────────────────────────────────┘   │
│                                    │ ✓ Approved                              │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ LEVEL 2: BUSINESS UNIT APPROVAL                                      │   │
│   │ Approver: Business Unit Head                                         │   │
│   │ Action: Review business impact and completeness                      │   │
│   └────────────────────────────────┬────────────────────────────────────┘   │
│                                    │ ✓ Approved                              │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ LEVEL 3: GROUP ESG APPROVAL                                          │   │
│   │ Approver: ESG Team Lead                                              │   │
│   │ Action: Validate ESG compliance and standards                        │   │
│   └────────────────────────────────┬────────────────────────────────────┘   │
│                                    │ ✓ Approved                              │
│                                    ▼                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │ LEVEL 4: EXECUTIVE APPROVAL                                          │   │
│   │ Approver: Executive/Director                                         │   │
│   │ Action: Final sign-off for publication                               │   │
│   └────────────────────────────────┬────────────────────────────────────┘   │
│                                    │ ✓ Approved                              │
│                                    ▼                                         │
│                          ✅ DATA PUBLISHED                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## API Endpoints (8 Total)

| Endpoint | Method | Description | Response |
|----------|--------|-------------|----------|
| `/api/workflows` | GET | List all workflows with filters | `{success, data: [workflows]}` |
| `/api/workflows` | POST | Create new workflow (auto-creates 4 steps) | `{success, data: workflow}` |
| `/api/workflows/stats` | GET | Get workflow statistics | `{pending: 1, approved: 0, rejected: 0, total: 1}` |
| `/api/workflows/all-notifications` | GET | All notifications (admin/supervisor) | `{success, data: [notifications]}` |
| `/api/workflows/notifications/:userId` | GET | User-specific notifications | `{success, data: [notifications]}` |
| `/api/workflows/:id` | GET | Get single workflow with all steps | `{success, data: workflow}` |
| `/api/workflows/:id/approve` | POST | Approve current level | `{success, message}` |
| `/api/workflows/:id/reject` | POST | Reject workflow | `{success, message}` |
| `/api/workflows/audit/logs` | GET | Get blockchain audit trail | `{success, data: [logs]}` |

## Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE TABLES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   approval_workflows              approval_steps                             │
│   ┌─────────────────────┐        ┌─────────────────────┐                    │
│   │ id (UUID) PK        │───┐    │ id (UUID) PK        │                    │
│   │ title               │   │    │ workflowId (FK) ────┘                    │
│   │ submittedBy         │   │    │ level (1-4)         │                    │
│   │ status              │   │    │ approverRole        │                    │
│   │ currentLevel (1-4)  │   │    │ approver            │                    │
│   │ esgDataId           │   │    │ status              │                    │
│   │ metadata (JSONB)    │   │    │ comments            │                    │
│   │ createdAt           │   │    │ actionAt            │                    │
│   │ updatedAt           │   │    │ createdAt           │                    │
│   └─────────────────────┘   │    └─────────────────────┘                    │
│                             │                                                │
│   audit_logs                │    notifications                               │
│   ┌─────────────────────┐   │    ┌─────────────────────┐                    │
│   │ id (UUID) PK        │   │    │ id (UUID) PK        │                    │
│   │ action              │   │    │ userId              │                    │
│   │ userId              │   │    │ title               │                    │
│   │ category            │   │    │ message             │                    │
│   │ details             │   │    │ type (info/error)   │                    │
│   │ metadata (JSONB)    │   │    │ read (boolean)      │                    │
│   │ previousHash        │   └───►│ workflowId (FK)     │                    │
│   │ hash (SHA-256)      │        │ createdAt           │                    │
│   │ createdAt           │        └─────────────────────┘                    │
│   └─────────────────────┘                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Workflow Creation Process

```javascript
// File: backend/routes/workflowRoutes.js (ES Modules)
import express from 'express';
import { ApprovalWorkflow, ApprovalStep, AuditLog, Notification } from '../models/index.js';

// POST /api/workflows
// 1. Create workflow record
const workflow = await ApprovalWorkflow.create({
  title: "Q4 2024 ESG Report",
  submittedBy: "dataentry@esgenius.com",
  status: "pending",
  currentLevel: 1
});

// 2. Auto-create 4 approval steps
const levels = [
  { level: 1, role: 'SITE' },
  { level: 2, role: 'BUSINESS_UNIT' },
  { level: 3, role: 'GROUP_ESG' },
  { level: 4, role: 'EXECUTIVE' }
];

// 3. Create audit log entry
await AuditLog.create({
  action: 'WORKFLOW_CREATED',
  userId: submittedBy,
  hash: SHA256(data + previousHash + timestamp)
});

// 4. Send notification to Level 1 approvers
await Notification.create({
  userId: 'site_approvers',
  title: 'New Approval Request',
  message: 'New workflow requires Site Level approval'
});
```

## Approval Process

```javascript
// POST /api/workflows/:id/approve
// Body: { level: 1, approver: "site@company.com", comments: "Approved" }

// 1. Validate current level matches request
if (workflow.currentLevel !== level) throw Error("Wrong level");

// 2. Update step status
await step.update({ status: 'approved', approver, comments });

// 3. If Level 4 → Mark workflow as approved
// 4. Else → Move to next level, notify next approvers
// 5. Create audit log with blockchain hash
```

## Blockchain-Style Audit Trail

```javascript
// Every action creates an immutable audit record
{
  action: "STEP_APPROVED",
  userId: "supervisor@esgenius.com",
  details: "Level 1 approved for Q4 Report",
  previousHash: "a1b2c3d4e5f6...",  // Hash of previous log
  hash: "f6e5d4c3b2a1..."           // SHA-256(data + previousHash + timestamp)
}

// This creates a chain that cannot be tampered with
// If any record is modified, all subsequent hashes become invalid
```

---

# 🔧 TECHNICAL IMPLEMENTATION

## ES Modules Conversion
All backend files now use ES Modules (import/export) instead of CommonJS (require/module.exports).

```javascript
// OLD (CommonJS)
const express = require('express');
module.exports = router;

// NEW (ES Modules)
import express from 'express';
export default router;
```

## Files Created/Modified

| File | Purpose | Module Type |
|------|---------|-------------|
| `backend/routes/analyticsRoutes.js` | Analytics API (7 endpoints) | ES Module |
| `backend/routes/workflowRoutes.js` | Approval workflow API (8 endpoints) | ES Module |
| `backend/routes/authRoutes.js` | Authentication API (4 endpoints) | ES Module |
| `backend/routes/esgRoutes.js` | ESG data API | ES Module |
| `backend/routes/kpiRoutes.js` | KPI API | ES Module |
| `backend/routes/reportsRoutes.js` | Reports API | ES Module |
| `backend/models/index.js` | Sequelize models (7 tables) | ES Module |
| `backend/middleware/cors.js` | CORS configuration | ES Module |
| `backend/middleware/errorHandler.js` | Global error handler | ES Module |
| `backend/config/database.js` | Database configuration | ES Module |
| `backend/server.js` | Entry point | ES Module |
| `frontend/src/Login.jsx` | Database authentication | React |
| `frontend/src/components/WorkflowDashboard.js` | Approval UI | React |

## Dependencies Used

```json
{
  "type": "module",
  "dependencies": {
    "express": "^5.0.1",
    "sequelize": "^6.37.5",
    "pg": "^8.13.1",
    "pg-hstore": "^2.3.4",
    "dotenv": "^16.4.7",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3"
  }
}
```

Note: `"type": "module"` in package.json enables ES Modules.

## How to Test

### Terminal Commands (PowerShell):
```powershell
# Analytics KPIs
Invoke-RestMethod -Uri "http://localhost:5000/api/analytics/kpis" | ConvertTo-Json

# Category Distribution
Invoke-RestMethod -Uri "http://localhost:5000/api/analytics/category-distribution" | ConvertTo-Json

# Risk Assessment
Invoke-RestMethod -Uri "http://localhost:5000/api/analytics/risk-assessment" | ConvertTo-Json

# Approval Stats
Invoke-RestMethod -Uri "http://localhost:5000/api/workflows/stats" | ConvertTo-Json

# All Notifications (for supervisors/admins)
Invoke-RestMethod -Uri "http://localhost:5000/api/workflows/all-notifications" | ConvertTo-Json

# User Login
$body = @{ email="supervisor1@esgenius.com"; password="Super@2025" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/auth/login" -Method POST -Body $body -ContentType "application/json"

# Create Workflow
$body = @{ title="Test"; submittedBy="test@test.com" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:5000/api/workflows" -Method POST -Body $body -ContentType "application/json"
```

### PostgreSQL Commands:
```sql
-- Check ESG data
SELECT category, COUNT(*) FROM esg_data GROUP BY category;

-- Check workflows
SELECT title, status, "currentLevel" FROM approval_workflows;

-- Check approval steps
SELECT level, "approverRole", status FROM approval_steps ORDER BY level;

-- Check users by role
SELECT role, COUNT(*) FROM users GROUP BY role;

-- Check notifications
SELECT title, message, "userId" FROM notifications ORDER BY "createdAt" DESC;
```

---

# 🔐 AUTHENTICATION MODULE

## Overview
Database-based authentication with 48 pre-configured user accounts.

## User Accounts

| Role | Email Pattern | Password | Count |
|------|---------------|----------|-------|
| Super Admin | `superadmin1-3@esgenius.com` | `Admin@2025` | 3 |
| Supervisor | `supervisor1-15@esgenius.com` | `Super@2025` | 15 |
| Data Entry | `dataentry1-30@esgenius.com` | `Data@2025` | 30 |

## Auth API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | Login with email/password |
| `/api/auth/register` | POST | Create new user |
| `/api/auth/users` | GET | List all users |
| `/api/auth/users/stats` | GET | User count by role |

## Login Flow

```javascript
// Frontend: Login.jsx
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});

// Backend: authRoutes.js
// 1. Find user by email
// 2. Compare password with bcrypt
// 3. Return user data + role
// 4. Frontend stores in localStorage
```

---

# 📱 UI INTEGRATION

## Analytics Page (Analytics.js)
- Displays KPI cards (Overall: 80, E: 72, S: 82, G: 87)
- Shows category distribution pie chart
- Displays monthly trends line graph
- Shows performance vs targets bar chart
- Risk distribution doughnut chart
- Framework compliance panel (GRI, SASB, TCFD, CSRD)
- Mining sector compliance (Zimbabwe regulations)
- Auto-refreshes every 30 seconds

### Data Flow:
```
Analytics.js → APIService.getESGKPIs() → /api/esg/kpis/:userId → PostgreSQL
Analytics.js → APIService.getESGData() → /api/esg/data/:userId → PostgreSQL
```

## Approval Page (WorkflowDashboard.js)
- Lists all pending/approved/rejected workflows
- Shows 4-level progress indicator
- Approve/Reject buttons for current level (supervisors/admins only)
- Audit trail viewer
- Notification panel (role-based)
  - Admins/Supervisors: See all notifications via `/api/workflows/all-notifications`
  - Data Entry: See only their notifications via `/api/workflows/notifications/:userId`
- Auto-refreshes every 30 seconds

### Data Flow:
```
WorkflowDashboard.js → fetch('/api/workflows') → PostgreSQL
WorkflowDashboard.js → fetch('/api/workflows/stats') → PostgreSQL
WorkflowDashboard.js → fetch('/api/workflows/all-notifications') → PostgreSQL
```

## Login Page (Login.jsx)
- Database authentication (not localStorage)
- Role-based redirect after login
- Supports all 48 pre-configured accounts

---

**Last Updated:** December 31, 2025  
**Questions? Contact: Venkat**
