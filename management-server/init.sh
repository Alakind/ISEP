#!/bin/bash
set -e

echo "PostgreSQL is ready. Starting restore process."

# Restore the database
pg_restore -Fc --no-owner -U "$POSTGRES_USER" --create -v -d demo /dump/seed.dump

echo "Database restore completed."
