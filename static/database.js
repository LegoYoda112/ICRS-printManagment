const database = Object.create(null);

const fetch = window.fetch;

const json = (response) => response.json();

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

database.getPrinters = function () {
    return database.query({
        "requestType": "getPrinterList"
    });
}

database.getLatestPrints = function () {
    return database.query({
        "requestType": "getLatestPrints",
        "num": 10
    });
}

export default Object.freeze(database);