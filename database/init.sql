-- Create database if it doesn't exist
DO
$$
BEGIN
    IF NOT EXISTS (
        SELECT
        FROM pg_catalog.pg_database
        WHERE datname = 'scheduler'
    ) THEN
        PERFORM 'CREATE DATABASE scheduler';
    END IF;
END
$$;

-- Connect to the database
\c scheduler

-- Create table if it doesn't exist
-- Tracks the users' data
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password_hash TEXT NOT NULL,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tracks the different recurrence types for the user to choose
CREATE TABLE IF NOT EXISTS recurrence (
    id SERIAL PRIMARY KEY,
    recurrence_type VARCHAR(255) NOT NULL,
    time_unit VARCHAR(255) NOT NULL,
    recurrence_amount INT NOT NULL,
    recurrence_description TEXT
);

-- Tracks the event data
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users (id) NOT NULL ON DELETE CASCADE,
    recurrence_id INT REFERENCES recurrence (id) ON DELETE RESTRICT,
    event_name VARCHAR(255) NOT NULL,
    event_description TEXT,
    event_date DATE NOT NULL,
    event_time TIME NOT NULL,
    event_location VARCHAR(255),
    event_organizer VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- a table to keep the refersh tokens
CREATE TABLE refresh_token (
    token TEXT NOT NULL,
    user_id INT NOT NULL REFERENCES "user" (user_id) ON DELETE CASCADE,
    expires DATE NOT NULL
);