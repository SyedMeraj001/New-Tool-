#!/bin/bash
set -e

echo "🚀 Initializing database schema..."

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

# Load .env using POSIX-compatible syntax
set -a
. "$SCRIPT_DIR/../.env"
set +a

# Use password automatically
export PGPASSWORD="$DB_PASSWORD"

SCHEMA_FILE="$SCRIPT_DIR/../new_tool_db_schema.sql"

psql -h "$DB_HOST" -U "$DB_USER" -d "$DB_NAME" -f "$SCHEMA_FILE"

echo "✅ Database initialized successfully"
