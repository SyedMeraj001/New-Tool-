# ESG Reporting System

A comprehensive Environmental, Social, and Governance (ESG) reporting platform with advanced analytics, compliance tracking, and multi-framework support.

## Project Structure

```
pia/
├── backend/                 # Node.js/Express backend
├── frontend/               # React frontend application
├── docs/                   # Documentation and guides
├── scripts/                # Utility and deployment scripts
├── tests/                  # Test files and configurations
└── config/                 # Configuration files
```

## Quick Start

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## Features

- Multi-framework ESG reporting (GRI, SASB, TCFD, BRSR)
- Real-time IoT data integration
- Advanced analytics and benchmarking
- Audit trail and compliance tracking
- Role-based access control (RBAC)
- Professional PDF report generation

## Documentation

See the `docs/` directory for detailed guides and implementation instructions.



db dump 

export PGPASSWORD=Es@2025
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE esg_dashboard;" || echo "DB already exists"
psql -U postgres -h localhost -p 5432 -d esg_dashboard -f backend/database/pia_db_dump.sql
