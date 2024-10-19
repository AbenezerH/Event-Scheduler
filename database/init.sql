CREATE DATABASE scheduler;

-- Connect to the database
\c scheduler

-- Create table if it doesn't exist
-- Tracks the users' data
CREATE TABLE IF NOT EXISTS "users" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tracks the different recurrence types for the user to choose
CREATE TABLE IF NOT EXISTS recurrence (
    id SERIAL PRIMARY KEY,
    recurrence_type VARCHAR(255) NOT NULL,
    time_unit VARCHAR(255) NOT NULL,
    recurrence_amount VARCHAR(50) NOT NULL,
    relative_recurrence_by VARCHAR(20),
    selected_days JSON,
    recurrence_description TEXT
);

-- Tracks the event data
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES "users" (id) ON DELETE CASCADE,
    recurrence_id INT REFERENCES recurrence (id) ON DELETE RESTRICT,
    event_title VARCHAR(255) NOT NULL,
    event_description TEXT,
    event_date TIMESTAMP NOT NULL,
    event_location VARCHAR(255),
    event_organizer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- a table to keep the refersh tokens
CREATE TABLE IF NOT EXISTS refresh_token (
    token TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES "users" (id) ON DELETE CASCADE,
    expires DATE NOT NULL
);