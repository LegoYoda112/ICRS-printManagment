import handler from "./handler.js";
import auth from "./auth.js";
import express from "express";
import cors from "cors";
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

function sendError(err, statusCode, res) {
    console.error(err);
    res.status(statusCode).end("ERROR: " + err.message);
}

// API interface
app.use("/printFarm", express.json());
app.post("/printFarm", cors(), function (req, res) {
    console.log(req.get('origin'));
    console.log(req.get('host'));
    const requestObject = req.body;
    console.debug("Recived POST request!");
    auth.authAPIKey(requestObject, db).then(function (keyData) {
        // Only runs when key is authed
        handler(requestObject, db).then(function (responseObject) {
            // Return data as JSON
            res.setHeader("Content-Type", "application/json");
            console.debug(responseObject);
            res.end(JSON.stringify(responseObject));
        }).catch(function (err) {
            // Log errors in console and return them to sender
            sendError(err, 400, res);
        });
    }).catch(function (err) {
        sendError(err, 401, res);
    });
});

// APIKey test request
app.use("/APIKey", express.json());
app.post("/APIKey", function (req, res) {
    const requestObject = req.body;
    auth.authAPIKey(requestObject, db).then(function (keyData) {
        // Only runs if key is authed
        res.end("Valid api key and id");
    }).catch(function (err) {
        sendError(err, 401, res);
    });
});

app.listen(port, function () {
    console.log("Listening on port " + port);
});