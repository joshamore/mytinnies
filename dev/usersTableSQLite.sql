/*
    Statement to create the users SQLite3 table (NOTE: this is a testing only table not designed for deployment).
*/
CREATE TABLE users (
    record_id INTEGER PRIMARY KEY,
    user_id INTEGER,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password_hash TEXT
);