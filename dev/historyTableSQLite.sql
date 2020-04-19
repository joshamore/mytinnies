/*
    Creates a table for tinnies drinking history.

    NOTE: SQLite3 doesn't have a date/time type. Instead, date is stored as a unix timestamp in a String.
*/
CREATE TABLE "history" (
	"history_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"drank"	INTEGER NOT NULL,
	"datetime"	TEXT NOT NULL
);