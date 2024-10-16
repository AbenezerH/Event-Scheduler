#!/bin/bash

# Load environment variables from .env file if it exists
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Function to check if variable is set and prompt for it if not
check_var() {
    local var_name=$1
    local var_value=$(eval echo \$$var_name)

    if [ -z "$var_value" ]; then
        read -p "Enter $var_name: " var_value
        export $var_name=$var_value
    fi
}

# Check required variables
check_var DB_USERNAME
check_var DB_NAME
check_var DB_PASSWORD

# Step 1: Run the database initializer
echo "Initializing database..."
PGPASSWORD=$DB_PASSWORD psql -U $DB_USERNAME -f database/init.sql

# Step 2: Wait for the database to start
echo "Waiting for database to be ready..."
until PGPASSWORD=$DB_PASSWORD psql -U $DB_USERNAME -c '\l'; do
  >&2 echo "Database is starting up"
  sleep 1
done

# Step 3: Run the backend server initializer
echo "Initializing backend server..."
cd backend
npm install
npm start &

# Step 4: Run the frontend server initializer
echo "Initializing frontend server..."
cd ../frontend
npm install
npm start &

echo "All services initialized!"
