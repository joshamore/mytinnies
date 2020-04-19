/*
    Creates a table for tinnies drinking history.

	posorneg explainer: will be -1 if history_tinnies_count is a reduction and 1 if history_tinnies_count is
	an addition.
    NOTE: SQLite3 doesn't have a date/time type. Instead, date is stored as a unix timestamp in a String.
*/
CREATE TABLE "history" (
	"history_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_id"	INTEGER NOT NULL,
	"history_tinnies_count"	INTEGER NOT NULL,
	"datetime"	TEXT NOT NULL,
	"pos_or_neg"	INTEGER NOT NULL
);