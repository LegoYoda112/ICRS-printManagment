const database = Object.create(null);

// Helper functions
const fetch = window.fetch;
const json = (response) => response.json();

// Ajax request
database.query = function (requestObj) {
    const body = JSON.stringify(requestObj);
    return fetch("/printFarm", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
};

// Database calls
database.getPrinters = function () {
    return database.query({
        "requestType": "getPrinterList"
    });
};

database.getLatestPrints = function () {
    return database.query({
        "requestType": "getLatestPrints",
        "num": 10
    });
};

export default Object.freeze(database);