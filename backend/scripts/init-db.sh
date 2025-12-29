#!/bin/bash

echo "🚀 Initializing database schema..."

psql -U postgres -d new_tool_db -f ../new_tool_db_schema.sql

echo "✅ Database schema applied"
