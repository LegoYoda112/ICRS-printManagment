import database from "./database.js";

const UI = Object.create(null);

const el = (id) => document.getElementById(id);
const cloneTemplate = (id) => document.importNode(el(id).content, true);

const printerList = el("printer-list");
const printList = el("print-list");

const printerUpdateSpeed = 5000;

function updatePrinter(printerElement, printer) {
    const qs = (query) => printerElement.querySelector(query);

    const printerImage = qs(".printer-image");
    const progressBar = qs(".progress-bar");
    const progressBarBar = qs(".progress-bar-bar");
    const progressBarStatus = qs(".progress-bar-status");
    const status = qs(".status");
    const remainingTime = qs(".remaining-time");
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

            progress.textContent = `Progress: ${printer.progress}%`;
            remainingTime.textContent = `${printer.remaining_time} mins?`;
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

UI.init = function () {

    updatePrinters();
    //Update printers every 5 seconds
    let printerUpdateID = setTimeout(function update() {
        updatePrinters();
        // console.log("timer ran");

        printerUpdateID = setTimeout(update, printerUpdateSpeed);
    }, printerUpdateSpeed);

    // database.getLatestPrints().then(function (prints) {
    //     console.log(prints);
    //     prints.forEach(function (print) {
    //         console.log(print);
    //     });
    // });
};

export default Object.freeze(UI);