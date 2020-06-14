import handler from "./handler.js";
import auth from "./auth.js";
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
app.use("/printFarm", express.json());

app.use("/API/", express.json());
app.get("/API/:requestType", cors(), function (req, res) {
    handler(req, db).then(function (responseObject) {
        console.log(responseObject);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(responseObject));
    }).catch(function (err) {
        sendError(err, 401, res);
    });
});

app.post("/API/:requestType", cors(), function (req, res) {
    handler(req, db).then(function (responseObject) {
        console.log(responseObject);
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(responseObject));
    }).catch(function (err) {
        sendError(err, 401, res);
    });
});

app.post("/printFarm", cors(), function (req, res) {
    console.debug("Recived POST request!");
    console.log(req);

    auth.authAPIKey(req, db).then(function (keyData) {
        // Only runs when key is authed
        handler(req, db).then(function (responseObject) {
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

app.get("/printFarm", function (req, res) {
    console.debug("Recived POST request!");
    
    handler(req, db).then(function (responseObject) {
        // Return data as JSON
        res.setHeader("Content-Type", "application/json");
        console.debug(responseObject);
        res.end(JSON.stringify(responseObject));
    }).catch(function (err) {
        // Log errors in console and return them to sender
        sendError(err, 400, res);
    });
});


// APIKey test request
app.use("/APIKey", express.json());
app.post("/APIKey", function (req, res) {
    auth.authAPIKey(req, db).then(function (keyData) {
        // Only runs if key is authed
        res.end("Valid api key and id");
    }).catch(function (err) {
        sendError(err, 401, res);
    });
});

app.listen(port, function () {
    console.log("Listening on port " + port);
});