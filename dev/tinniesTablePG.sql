/*
    The query used to create the tinnies table in Postgres.
*/

CREATE TABLE tinnies(
    record_id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE NOT NULL,
    tinnies INTEGER NOT NULL
);