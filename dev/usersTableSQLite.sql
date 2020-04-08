/*
    Statement to create the users SQLite3 table (NOTE: this is a testing only table not designed for deployment).
*/
CREATE TABLE "users" (
	"user_id"	INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT UNIQUE,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"email"	TEXT UNIQUE,
	"password_hash"	TEXT
);