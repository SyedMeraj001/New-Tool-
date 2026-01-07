# Database Setup Guide

## Quick Fix for Stakeholder Database Issue

### Problem
Stakeholder data shows in UI but not saved to database.

### Solution

1. **Start PostgreSQL** (make sure it's running)

2. **Create/Setup Database**
   ```bash
   cd backend/scripts
   setup-database.bat
   ```

3. **Test Database Connection**
   ```bash
   cd backend
   node check-db-connection.js
   ```

4. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

5. **Test API Endpoints** (optional)
   ```bash
   cd backend
   node test-api.js
   ```

### Database Configuration

Current settings in `.env`:
- Database: `new_tool_db`
- Host: `localhost:5432`
- User: `postgres`
- Password: `Strong123`

### Troubleshooting

**Connection Refused:**
- Make sure PostgreSQL is running
- Check if port 5432 is available

**Authentication Failed:**
- Verify password in `.env` file
- Make sure PostgreSQL user exists

**Database Not Found:**
- Run `setup-database.bat` to create database
- Check database name in `.env`

### Frontend Integration

The frontend now:
- ✅ Loads stakeholders from database on page load
- ✅ Saves new stakeholders to database
- ✅ Updates existing stakeholders in database
- ✅ Deletes stakeholders from database

All changes are now persistent!