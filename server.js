import handler from "./handler.js";
import express from "express";
import sqlite3 from "sqlite3";
console.log(sqlite3.VERSION);
const port = 8080;
const app = express();

// Load database
let db = new sqlite3.Database("./db/printFarm.sqlite", (err) => {
    if(err) {
        console.log(err.message);
    }
    console.log("Connected to database.");
});

// Set up site
app.use("/", express.static("static"));

app.use("/printFarm", express.json());
app.post("/printFarm", function(req, res) {
    const requestObject = req.body;
    console.log("Recived POST request!");

    handler(requestObject, db).then(function (responseObject) {
        res.setHeader("Content-Type", "application/json");
        console.log(responseObject);
        res.end(JSON.stringify(responseObject));
    });
});

app.get("/printFarm", function(req, res) {
    const requestObject = req.body;
    console.log("Recived GET request!");

    handler(requestObject, db).then(function (responseObject) {
        res.setHeader("Content-Type", "application/json");
        console.log(responseObject);
        res.end(JSON.stringify(responseObject));
    });
});

app.listen(port, function () {
    console.log("Listening on port " + port);
})