// testing helpers
const describe = window.describe;
const it = window.it;
const fc = window.fastcheck;
const chai = window.chai;

// request helpers
const fetch = window.fetch;
const json = function(response){
    if(response.status === 200){
        return response.json();
    } else {
        return new Promise(function(resolve, reject){
            response.text().then((text) => reject(new Error(text)));
        });
    }
};

const serverURL = "http://localhost:8080";
const APIURL = serverURL + "/API/";


// Testing API keys (would be removed in production)
const adminKey = {
    id: 1,
    key: "7l1EGDVzcPuGHZzv"
};

const activeKey = {
    id: 2,
    key: "rIkC4tIHT09ervT7"
};

const inactiveKey = {
    id: 3,
    key: "fnpVW7AQwK0cCGqP"
};

// API request functions
const APIGET = (type) => fetch(APIURL + type, {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json"
    }
}).then(json);

const APIPOST = (type, body) => fetch(APIURL + type, {
    "method": "POST",
    "body": JSON.stringify(body),
    "headers": {
        "Content-Type": "application/json"
    }
}).then(json);

// Tests
describe("Mocha", function () {
    it("Correctly initialises Mocha", function () {
    });

    it("Correctly initialises FastCheck", function () {
        fc.assert(fc.property(fc.integer(), () => true));
    });
});

describe("API", function () {
    describe("Server", function() {
        it("server/API returns 200", function (done) {
            fetch(APIURL, {
                "method": "GET"
            }).then(function (response) {
                console.log(response);
                
                if (response.status === 200){
                    done();
                } else {
                    done("Server response is not 200");
                }
            }).catch(function (err) {
                done(err);
            });
        });
    });
    describe("getPrinterList and POST rejection", function() {
        it("Accepts GET request and returns list", function (done) {
            APIGET("getPrinterList").then(function (response) {
                console.log(response);
                if (response.length > 0){
                    done();
                } else {
                    done("Did not return list");
                }
            }).catch(function (err) {
                done(err);
            });
        });
        it("Does not accept POST request", function (done) {
            APIPOST("updatePrinter", {}).then(function (response) {
                console.log(response);
                done(new Error("Returned json"));
            }).catch(function (err) {
                done();
            });
        });
    });

    describe("updatePrinter and API keys", function() {
        it("Accepts POST request with active api_key and returns list", function (done) {
            APIPOST("updatePrinter", {
                "printer_id": 1,
                "progress": 100,
                "api_id": activeKey.id,
                "api_key": activeKey.key
            }).then(function (response) {
                console.log(response);
                if (response.length > 0){
                    done();
                } else {
                    done("Did not return list");
                }
            }).catch(function (err) {
                done(err);
            });
        });
        it("Accepts POST request with admin api_key and returns list", function (done) {
            APIPOST("updatePrinter", {
                "printer_id": 1,
                "progress": 100,
                "api_id": adminKey.id,
                "api_key": adminKey.key
            }).then(function (response) {
                console.log(response);
                if (response.length > 0){
                    done();
                } else {
                    done("Did not return list");
                }
            }).catch(function (err) {
                done(err);
            });
        });
        it("Does not accept POST request with inactive api_key", function (done) {
            APIPOST("updatePrinter", {
                "printer_id": 1,
                "progress": 100,
                "api_id": inactiveKey.id,
                "api_key": inactiveKey.key
            }).then(function (response) {
                console.log(response);
                done(new Error("Returned json"));
            }).catch(function (err) {
                done();
            });
        });
        it("Does not accept GET request", function (done) {
            APIGET("updatePrinter").then(function (response) {
                console.log(response);
                done(new Error("Returned json"));
            }).catch(function (err) {
                done();
            });
        });
        it("Rejects POST request with no printer_id or printer_name", function (done) {
            APIPOST("updatePrinter", {
                "progress": 100,
                "api_id": activeKey.id,
                "api_key": activeKey.key
            }).then(function (response) {
                console.log(response);
                done(new Error("Returned json"));
            }).catch(function (err) {
                done();
            });
        });
    });
});