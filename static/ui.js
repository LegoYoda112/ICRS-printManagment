import database from "./database.js";

const UI = Object.create(null);

const el = (id) => document.getElementById(id);
const cloneTemplate = (id) => document.importNode(el(id).content, true);

const printerList = el("printer-list");
const printList = el("print-list");

const printerUpdateSpeed = 5000;

function updatePrinter(printerElement, printer) {
    const qs = (query) => printerElement.querySelector(query);

    if (printer.status !== "OK") {
        qs(".printer-image").style.filter = "grayscale(100%)";
    } else {
        qs(".printer-image").style.filter = "grayscale(0%)";
    }

    qs(".printer-name").textContent = printer.name;
    qs(".status").textContent = printer.status;
    qs(".progress").textContent = printer.progress;
    qs(".remaining-time").textContent = printer.remaining_time;
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
                printerList.appendChild(newPrinter);
            }
        });
    });

}

UI.init = function () {
    let printerUpdateID = setTimeout(function update() {
        updatePrinters();
        console.log("timer ran");

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