/*
    Statement to create the tinnies SQLite3 table (NOTE: this is a testing only table not designed for deployment).
    The user_id needs to come from the users table (i.e the user must be created first)
*/
CREATE TABLE "tinnies" (
	"record_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_id"	INTEGER NOT NULL UNIQUE,
	"tinnies"	INTEGER
);