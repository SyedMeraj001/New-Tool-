@echo off
echo 🚀 Setting up database...

REM Set password for PostgreSQL
set PGPASSWORD=Strong123

echo Creating database if it doesn't exist...
psql -U postgres -h localhost -p 5432 -c "CREATE DATABASE new_tool_db;" 2>nul || echo Database already exists

echo Applying schema...
psql -U postgres -h localhost -p 5432 -d new_tool_db -f ../new_tool_db_schema.sql

echo ✅ Database setup complete!
pause