/*
    The query used to create the history table in Postgres.
*/

CREATE TABLE history(
    history_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    history_tinnies_count INTEGER NOT NULL,
    datetime VARCHAR(50) NOT NULL,
    pos_or_neg SMALLINT NOT NULL
);