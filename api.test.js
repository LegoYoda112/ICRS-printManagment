import handler from "./handler.js";
import sqlite3 from "sqlite3";

const describe = window.describe;
const it = window.it;
const fc = window.fastcheck;
const chai = window.chai;

const serverURL = "http://localhost:8080";
const api = "printFarm";

// Load database
let db = new sqlite3.Database("./db/printFarm.sqlite", function (err) {
    if (err) {
        console.error(err.message);
    }
    console.debug("Connected to database.");
});

describe("Mocha", function () {
    it("Correctly initialises Mocha", function () {
    });

    it("Correctly initialises FastCheck", function () {
        fc.assert(fc.property(fc.integer(), () => true));
    });
});

describe("API handler", function () {
    it("Handler imports correctly", function () {
        chai.assert.isNotNull(handler, "handler is not null");
    });

    it("handlers", function (done) {
        handler({
            "requestType": "getPrinterList"
        }).then(function (result) {
            console.log(result);
            done();
        });
    });
});