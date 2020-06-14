const database = Object.create(null);

// Helper functions
const fetch = window.fetch;
const json = (response) => response.json();

// Ajax request
database.queryGET = function (requestObj) {
    const body = JSON.stringify(requestObj);
    return fetch("/printFarm", {
        "method": "GET",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// Database calls
database.getPrinters = function () {
    return database.queryGET({
        "requestType": "getPrinterList"
    });
};

database.getLatestPrints = function () {
    return database.queryGET({
        "requestType": "searchPrints",
        "datetime":
        {"comparison": ">=", "value": "datetime('now', '-7 days')"}
    });
};

export default Object.freeze(database);