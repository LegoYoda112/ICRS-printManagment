const UI = Object.create(null);

const el = (id) => document.getElementById(id);
const json = (response) => response.json();

function updatePrinter(requestObj){
    const body = JSON.stringify(requestObj);
    return fetch("http://localhost:8080/API/updatePrinter", {
        "method": "POST",
        "body": body,
        "headers": {
            "Content-Type": "application/json"
        }
    }).then(json);
}

function updatePrinters(){
    let name = el("printer_name").value;
    let state = el("state").value;
    let progress = el("progress").value;
    let timeLeftMins = el("remaining_time").value;

    console.log(state);
    console.log(progress);
    console.log(timeLeftMins);

    const body = {
        "name": name,
        "progress": progress,
        "remaining_time": timeLeftMins,
        "status": state,
        "api_id": 2,
	    "api_key": "rIkC4tIHT09ervT7" // Would be changed in production
    };
    updatePrinter(body);
}


UI.init = function () {
    console.log("init");

    el("submit").onclick = updatePrinters;
};

export default Object.freeze(UI);