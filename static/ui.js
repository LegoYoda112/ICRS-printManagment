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
        case "Avalible":
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
                // console.log(newPrinter);
                updatePrinter(newPrinter, printer);
                newPrinter.querySelector(".printer").id = printer.printer_id;
                printerList.querySelector(".middle-box").appendChild(newPrinter);
            }
        });
    });
}

function updateCanvas(){
    let canvas = printChartCanvas;
    let w = canvas.width = canvas.clientWidth;
    let h = canvas.height = canvas.clientHeight;
    let ctx = canvas.getContext('2d');

    let points = [10,200,200,210,100,300,0,50,70,20];
    let dx = w/points.length;

    for (let i = 0; i < points.length; i ++)
    {
        ctx.beginPath(); //Start path
        ctx.arc(i*dx, h-points[i], 5, 0, Math.PI * 2); // Draw a point using the arc function of the canvas with a point structure.
        ctx.fill(); // Close the path and fill.
    }

    ctx.moveTo(0,0);
    ctx.moveTo(0, points[0]);

    let i;
    for (i = 0; i < points.length - 1; i ++)
    {
        ctx.moveTo(i*dx, h-points[i]);
        ctx.bezierCurveTo(dx*i + dx/2, h-points[i], dx*(i+1) - dx/2, h-points[i+1], dx*(i+1), h-points[i+1]);
    }
    ctx.stroke();

    console.log("chart redrawn");
}

UI.init = function () {

    updatePrinters();
    //Update printers every 5 seconds
    let printerUpdateID = setTimeout(function update() {
        updatePrinters();
        // console.log("timer ran");

        printerUpdateID = setTimeout(update, printerUpdateSpeed);
    }, printerUpdateSpeed);
    updateCanvas();
    printChartCanvas.onload = updateCanvas;
    window.addEventListener("resize", updateCanvas);

    // database.getLatestPrints().then(function (prints) {
    //     console.log(prints);
    //     prints.forEach(function (print) {
    //         console.log(print);
    //     });
    // });
};

export default Object.freeze(UI);