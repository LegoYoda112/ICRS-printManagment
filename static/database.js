const database = Object.create(null);

// Helper functions
const fetch = window.fetch;
const json = (response) => response.json();

// Ajax request
database.query = function (type, method, requestObj) {
    const body = JSON.stringify(requestObj);
    if (method === "GET") {
        return fetch("/API/" + type, {
            "method": "GET",
            "headers": {
                "Content-Type": "application/json"
            }
        }).then(json);
    }
    if (method === "POST") {
        return fetch("/API/" + type, {
            "method": "POST",
            "body": body,
            "headers": {
                "Content-Type": "application/json"
            }
        }).then(json);
    }
};

// Database calls
database.getPrinters = function () {
    return database.query("getPrinterList", "GET");
};

database.getLatestPrints = function () {
    return database.query("searchPrints", "POST", {
        "datetime":
        {"comparison": ">=", "value": "datetime('now', '-7 days')"}
    });
};

export default Object.freeze(database);