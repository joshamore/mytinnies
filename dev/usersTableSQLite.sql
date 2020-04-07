/*
    Statement to create the users SQLite3 table (NOTE: this is a testing only table not designed for deployment).
*/
CREATE TABLE "users" (
	"record_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"user_id"	INTEGER UNIQUE,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"email"	TEXT UNIQUE,
	"password_hash"	TEXT
);