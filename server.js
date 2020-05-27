import handler from "./handler.js";
import express from "express";
import sqlite3 from "sqlite3";
const port = 8080;
const app = express();

// Load database
let db = new sqlite3.Database("./db/testing.db", (err) => {
    if(err) {
        console.log(err.message);
    }
    console.log('Connected to testing database.');
});

// Set up site
app.use("/", express.static("static"));

app.use("/printFarm", express.json());
app.post("/printFarm", function(req, res) {
    const requestObject = req.body;

    const responseObject = handler(requestObject, db);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(responseObject));
});

app.get("/printFarm", function(req, res) {
    const requestObject = req.body;
    console.log("Recived GET request!");

    const responseObject = handler(requestObject, db);
    console.log(responseObject);
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(responseObject));
});

app.listen(port, function () {
    console.log("Listening on port " + port);
})