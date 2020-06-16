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


// Testing API keys (these keys would be deactivated in production)
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

// Testing printer parameters
let testPrinterID = 1;
let type;
let IP;
let status;
let progress;
let remaining_time;

// API request functions
const apiGet = function (type) {
    return fetch(APIURL + type, {
    "method": "GET",
    "headers": {
        "Content-Type": "application/json"
    }
    }).then(json);
};

const apiPost = function (type, body) {
    console.log("Sending data: ");
    console.log(body);
    return fetch(APIURL + type, {
    "method": "POST",
    "body": JSON.stringify(body),
    "headers": {
        "Content-Type": "application/json"
    }
    }).then(json);
};

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
            apiGet("getPrinterList").then(function (response) {
                chai.expect(response).to.be.an("array").that.is.not.empty;

                // Logs initial values to assign later so test
                // does not permenently change change database state
                let printerData = response[testPrinterID];
                type = printerData.type;
                IP = printerData.IP;
                status = printerData.status;
                progress = printerData.progress;
                remaining_time = printerData.remaining_time;
                console.log(type);
                done();
            }).catch(function (err) {
                done(err);
            });
        });
        it("Rejects POST request correctly", function (done) {
            apiPost("updatePrinter", {}).then(function (response) {
                console.log(response);
                done(new Error("Returned json"));
            }).catch(function (err) {
                try {
                    chai.expect(err.message).to.equal(
                        "ERROR: Invalid HTTP method type");
                } catch (error) {
                    done(error);
                }
                done();
            });
        });
    });

    describe("updatePrinter and API keys", function() {
        it("Accepts POST request with active api_key and returns list",
            function (done) {
                apiPost("updatePrinter", {
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
        it("Accepts POST request with admin api_key and returns list",
            function (done) {
                apiPost("updatePrinter", {
                    "printer_id": 1,
                    "progress": 100,
                    "api_id": adminKey.id,
                    "api_key": adminKey.key
                }).then(function (response) {
                    console.log(response);
                    chai.expect(response).to.be.an("array").that.is.not.empty;
                    done();
                }).catch(function (err) {
                    done(err);
                });
        });
        it("Correctly rejects POST request with inactive api_key",
            function (done) {
                apiPost("updatePrinter", {
                    "printer_id": 1,
                    "progress": 100,
                    "api_id": inactiveKey.id,
                    "api_key": inactiveKey.key
                }).then(function (response) {
                    console.log(response);
                    done(new Error("Returned json"));
                }).catch(function (err) {
                    try {
                        chai.expect(err.message).to.equal(
                            "ERROR: Key is not active");
                    } catch (error) {
                        done(error);
                    }
                    done();
                });
        });
        it("Correctly rejects GET request", function (done) {
            apiGet("updatePrinter").then(function (response) {
                console.log(response);
                done(new Error("Returned json"));
            }).catch(function (err) {
                console.log(err.message);
                chai.expect(err.message).to.equal(
                    "ERROR: Invalid HTTP method type");
                done();
            });
        });
        it("Correctly rejects POST request with no printer_id or printer_name", function (done) {
            apiPost("updatePrinter", {
                "progress": 100,
                "api_id": activeKey.id,
                "api_key": activeKey.key
            }).then(function (response) {
                console.log(response);
                done();
            }).catch(function (err) {
                try {
                    chai.expect(err.message).to.equal(
                        "ERROR: Request must include a printer_id or name");
                } catch (error) {
                    done(error);
                }
                done();
            });
        });
        it("Zeros all printer parameters correctly", function (done) {
            apiPost("updatePrinter", {
                "type": "null",
                "printer_id": 1,
                "IP": "null",
                "status": "null",
                "progress": 0,
                "remaining_time": 0,
                "api_id": activeKey.id,
                "api_key": activeKey.key
            }).then(function (response) {
                const printer = response[0];
                chai.expect(printer.type).to.equal("null");
                chai.expect(printer.IP).to.equal("null");
                chai.expect(printer.status).to.equal("null");
                chai.expect(printer.progress).to.equal(0);
                chai.expect(printer.remaining_time).to.equal(0);
                console.log(response);
                done();
            }).catch(function (err) {
                done(err);
            });
        });
        it("Returns all printer parameters to original state correctly",
            function (done) {
                apiPost("updatePrinter", {
                    "type": type,
                    "printer_id": 1,
                    "IP": IP,
                    "status": status,
                    "progress": progress,
                    "remaining_time": remaining_time,
                    "api_id": activeKey.id,
                    "api_key": activeKey.key
                }).then(function (response) {
                    const printer = response[0];
                    chai.expect(printer.type).to.equal(type);
                    chai.expect(printer.IP).to.equal(IP);
                    chai.expect(printer.status).to.equal(status);
                    chai.expect(printer.progress).to.equal(progress);
                    chai.expect(printer.remaining_time).to.equal(remaining_time);
                    console.log(response);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            }
        );
    });

    describe("getAllPrints", function() {
        it("Accepts GET request and returns list", function (done) {
            apiGet("getAllPrints").then(function (response) {
                chai.expect(response).to.be.an("array").that.is.not.empty;
                console.log("getAllPrints:");
                console.log(response);
                done();
            }).catch(function (err) {
                done(err);
            });
        });
    });

    describe("searchPrints", function() {
        it("Accepts POST request and returns list given simple search",
            function (done) {
                apiPost("searchPrints", {
                    "api_id": activeKey.id,
                    "api_key": activeKey.key,
                    "datetime": {
                        "comparison": ">=",
                        "value": "datetime('now', '-1 year')"
                    }
                }).then(function (response) {
                    chai.expect(response).to.be.an("array");
                    console.log("searchPrints:");
                    console.log(response);
                    done();
                }).catch(function (err) {
                    done(err);
                });
            }
        );
    });
});