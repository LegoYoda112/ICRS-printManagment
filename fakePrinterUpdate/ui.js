const UI = Object.create(null);

const el = (id) => document.getElementById(id);
const json = (response) => response.json();

function updatePrinter(requestObj){
    const body = JSON.stringify(requestObj);
    return fetch("http://192.168.1.73:8080/API/updateprinter", {
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
        "requestType": "updatePrinter",
        "name": name,
        "progress": progress,
        "remaining_time": timeLeftMins,
        "status": state
    }
    updatePrinter(body);
}


UI.init = function () {
    console.log("init");

    el("submit").onclick = updatePrinters;
};

export default Object.freeze(UI);