import database from "./database.js";

const UI = Object.create(null);

const el = (id) => document.getElementById(id);
const cloneTemplate = (id) => document.importNode(el(id).content, true);

const printerList = el("printer-list");
const printChartCanvas = el("print-chart-canvas");

const printerUpdateSpeed = 5000;

function updatePrinter(printerElement, printer) {
    const qs = (query) => printerElement.querySelector(query);

    const printerImage = qs(".printer-image");
    const progressBar = qs(".progress-bar");
    const progressBarBar = qs(".progress-bar-bar");
    const progressBarStatus = qs(".progress-bar-status");
    const status = qs(".status");
    const remainingTime = qs(".remaining-time");
    let remainingTimeMins = printer.remaining_time;
    let hours = Math.floor(remainingTimeMins/60);
    let mins = Math.round(remainingTimeMins-hours*60);
    const progress = qs(".progress");

    qs(".printer-name").textContent = printer.name;
    progressBarStatus.textContent = printer.status;

    // Reset items
    status.textContent = "";
    remainingTime.textContent = "";
    progress.textContent = "";

    // Display different info based on printer state
    switch (printer.status) {
        case "Printing":
            printerImage.style.filter = "grayscale(0%)";

            progressBar.style.backgroundColor =
                "var(--printing-color-background)";
            progressBarBar.style.width = `${printer.progress}%`;
            progressBarBar.style.backgroundColor =
                "var(--printing-color-highlight)";

            progress.textContent = `Progress: ${printer.progress.toFixed(1)}%`;

            if(hours === 0){
                remainingTime.textContent = `${mins}m`;
            } else if(hours === 1){
                remainingTime.textContent = `1h ${mins}m`;
            } else {
                remainingTime.textContent = `${hours}h ${mins}m`;
            }
            break;
        case "Availible":
            printerImage.style.filter = "grayscale(0%)";

            progressBarBar.style.width = `100%`;
            progressBarBar.style.backgroundColor =
                "var(--avalible-color)";
            break;
        case "Offline":
            printerImage.style.filter = "grayscale(100%)";
            
            progressBarBar.style.width = `100%`;
            progressBarBar.style.backgroundColor =
                "var(--offline-color)";
            break;
        default:
            progressBarStatus.textContent = "Offline";
            printerImage.style.filter = "grayscale(100%)";

            progressBarBar.style.width = `100%`;
            progressBarBar.style.backgroundColor =
                "var(--offline-color)";

            status.textContent = `Status: ${printer.status}`;
    }
}

function updatePrinters(){
    const printerElements = document.getElementsByClassName("printer");

    // Create list of printers
    database.getPrinters().then(function (printers) {
        printers.forEach(function (printer) {
            let printerExists = false;
            
            // If printer element already exist in list
            // update it
            for (const printerElement of printerElements) {
                if(printer.printer_id == printerElement.id){
                    updatePrinter(printerElement, printer);
                    printerExists = true;
                }
            }

            // If printer element doesn't exist, add it
            if (!printerExists) {
                let newPrinter = cloneTemplate("printer");
                updatePrinter(newPrinter, printer);
                newPrinter.querySelector(".printer").id = printer.printer_id;
                printerList.querySelector(".middle-box").appendChild(newPrinter);
            }
        });
    });
}

function updatePrintCanvas(prints, printers){
    let canvas = printChartCanvas;
    let w = canvas.width = canvas.clientWidth;
    let h = canvas.height = canvas.clientHeight;
    let ctx = canvas.getContext('2d');
    
    prints.forEach(function (print) {
        let printDatetime = new Date(print.datetime);
        let nowDatetime = new Date();

        // Calcs
        let diffMins = ((printDatetime - nowDatetime)/1000)/60;
        let boxX = w + w * (diffMins / (7 * 24 * 60));
        let boxY = 20 * print.printer_id + 10;
        let boxW = w * (print.length / (7 * 24 * 60));

        // Draw box
        ctx.beginPath();
        ctx.rect(boxX, boxY, boxW, 10);
        ctx.fill();
    });



    let points = [10,200,200,210,100,300,0,50,70,20];

    console.log("chart redrawn");
}

UI.init = function () {

    // Initial printer update on load
    updatePrinters();

    // Start a timeout function that updates printers every 5 seconds
    let printerUpdateID = setTimeout(function update() {
        updatePrinters();

        printerUpdateID = setTimeout(update, printerUpdateSpeed);
    }, printerUpdateSpeed);

    // Draw printer usage chart and bind it to the resize for the window
    // allowing it to redraw the chart when the window changes size
    database.getLatestPrints().then(function (prints) {
        database.getPrinters().then(function (printers) {
            updatePrintCanvas(prints, printers);
            window.addEventListener("resize", updatePrintCanvas(prints, printers));
        });
    });
};

export default Object.freeze(UI);