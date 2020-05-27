import sqlite3 from "sqlite3";

// Load database
let db = new sqlite3.Database("./db/testing.db", (err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('Connected to testing database.');
});

// db.run(`INSERT INTO testing(message) VALUES ("TEST")`);

db.each("SELECT * FROM testing;", function(err, row) {
    if (err) {
        return console.log(err.message);
    }

    console.log(row);
});

db.close();