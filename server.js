import handler from "./handler.js";
import express from "express";
import sqlite3 from "sqlite3";

const port = 8080;
const app = express();

// Load database
let db = new sqlite3.Database("./db/printFarm.sqlite", function (err) {
    if (err) {
        console.error(err.message);
    }
    console.debug("Connected to database.");
});

// Set up site
app.use("/", express.static("static"));

// API interface
app.use("/printFarm", express.json());
app.post("/printFarm", function (req, res) {
    const requestObject = req.body;
    console.debug("Recived POST request!");

    handler(requestObject, db).then(function (responseObject) {
        // Return data as JSON
        res.setHeader("Content-Type", "application/json");
        console.debug(responseObject);
        res.end(JSON.stringify(responseObject));
    }).catch(function (err){
        // Log errors in console and return them to sender
        console.error(err);
        res.status(400).end("ERROR: " + err.message);
    });
});

app.listen(port, function () {
    console.log("Listening on port " + port);
});