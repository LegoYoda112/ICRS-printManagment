import fetch from "node-fetch";

// Helper functions
const json = (response) => response.json();

const printerUpdateSpeed = 5000;
const printerURL = "http://192.168.1.108";
const serverURL = "http://127.0.0.1:8080";

function getCurrentJob(URL){
    return fetch(URL + "/api/job", {
        "method": "GET",
        "headers": {
            "Content-Type": "application/json",
            "X-Api-Key": "F1AF6FF0674242E09AA4D615AF3D8403"
        }
    }).then(json);
}

function updatePrinter(requestObj, URL){
    const body = JSON.stringify(requestObj);
    return fetch(URL + "/printFarm", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
}

function updatePrinters(){
    getCurrentJob(printerURL).then(function (response) {
        let state = response.state;
        if (state === "Operational"){
            state = "Avalible";
        }
        let progress = response.progress.completion;
        let timeLeftMins = response.progress.printTimeLeft/60;

        console.log(state);
        console.log(progress);
        console.log(timeLeftMins);

        const body = {
            "requestType": "updatePrinter",
            "printer_id": 4,
            "progress": progress.toFixed(2),
            "remaining_time": timeLeftMins.toFixed(2)
        }
        return updatePrinter(body,serverURL);
    });
}

updatePrinters();
let printerPingID = setTimeout(function update() {
    updatePrinters();
    printerPingID = setTimeout(update, printerUpdateSpeed);
}, printerUpdateSpeed);