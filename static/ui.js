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

function getDayOfTheWeekString (dayInt){
    const daysOfTheWeek = ["Sun", "Mon", "Tue", "Wed", "Thurs", "Fri", "Sat"];
    const index = Math.abs(dayInt % 7);
    return daysOfTheWeek[index];
}

function updatePrintCanvas(prints, printers){
    // TODO: Could potentialy get screwed up by timezones
    // TODO: Make height dynamic
    let canvas = printChartCanvas;
    let w = canvas.width = canvas.clientWidth;
    let sidebarWidth = 90;
    let chartWidth = w - sidebarWidth;
    let h = canvas.height = canvas.clientHeight;
    let ctx = canvas.getContext('2d');
    let nowDatetime = new Date();
    
    const timeScale = 7 * 24 * 60; // one week

    const dayOffset = chartWidth * (nowDatetime.getHours()*60 + nowDatetime.getMinutes()) / timeScale;
    const nightLength = 7 * 60; // 0:00a - 7:00
    const noonOffset = chartWidth * (12 * 60) / timeScale; // mins between 0:00 and 12:00
    console.log(dayOffset);

    for(let i = 0; i < 8; i++){
        // Coordinate of midnight for given day
        let dayStartPos = w - chartWidth * (i/7) - dayOffset;

        ctx.fillStyle = "#e3e3e3";
        ctx.fillRect(dayStartPos, 0, chartWidth * (nightLength / timeScale), h - 40);
        ctx.fillStyle = "#7a8b99";
        ctx.fillRect(dayStartPos, 0, 1, h-40);

        ctx.fillStyle = "#edc88c";
        ctx.fillRect(dayStartPos + noonOffset, 0, 2, h - 40);

        ctx.fillStyle = "#222629";
        ctx.font = "12px Roboto Mono";
        ctx.fillText("0:00", dayStartPos, h - 25);
        ctx.fillText("12:00", dayStartPos + noonOffset, h - 25);

        ctx.fillText(getDayOfTheWeekString(nowDatetime.getDay() - i), dayStartPos, h - 10);
    }

    // Loop through prints and draw them
    prints.forEach(function (print) {
        let printDatetime = new Date(print.datetime);

        // Calcs
        let diffMins = ((printDatetime - nowDatetime)/1000)/60;
        let boxX = w + chartWidth * (diffMins / timeScale);
        let boxY = 25 * print.printer_id;
        let boxW = chartWidth * (print.length / timeScale);

        // Draw box
        ctx.fillStyle = "#FF6909";
        ctx.font = "16px Roboto Mono";
        ctx.fillRect(boxX, boxY, boxW, 15);
    });

    ctx.fillStyle = "white";
    ctx.fillRect(0,0, sidebarWidth, h);

    ctx.fillStyle = "#222629";
    printers.forEach(function (printer) {
        let textY = 25 * printer.printer_id;

        ctx.fillText(printer.name, 10, textY);
    });

    console.debug("Print chart redrawn");
}

UI.init = function () {

    // Initial printer update on load
    updatePrinters();

    // Start a timeout function that updates printers every 5 seconds
    let printerUpdateID = setTimeout(function update() {
        updatePrinters();
        console.debug("Printer update called");

        printerUpdateID = setTimeout(update, printerUpdateSpeed);
    }, printerUpdateSpeed);

    // Draw printer usage chart and bind it to the resize for the window
    // allowing it to redraw the chart when the window changes size
    database.getLatestPrints().then(function (prints) {
        database.getPrinters().then(function (printers) {
            window.addEventListener("resize", function(){
                console.log("test");
                updatePrintCanvas(prints, printers)
            });
            updatePrintCanvas(prints, printers);
        });
    });
};

export default Object.freeze(UI);