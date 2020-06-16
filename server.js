import handler from "./handler.js";
import express from "express";
import cors from "cors";
import sqlite3 from "sqlite3";

// Helper functions
function sendError(err, statusCode, res) {
    console.error(err);
    res.status(statusCode).end("ERROR: " + err.message);
}

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
app.use("/API/", cors(), express.json());
app.get("/API/", cors(), function (req, res){
    res.end("API is alive!");
});
app.get("/API/:requestType", function (req, res) {
    handler(req, db).then(function (responseObject) {
        console.log(responseObject);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(responseObject));
    }).catch(function (err) {
        sendError(err, 401, res);
    });
});

app.post("/API/:requestType", function (req, res) {
    handler(req, db).then(function (responseObject) {
        console.log(responseObject);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(responseObject));
    }).catch(function (err) {
        sendError(err, 401, res);
    });
});

// Start server
app.listen(port, function () {
    console.log("Listening on port " + port);
});