import database from "./database.js";

const UI = Object.create(null);

const el = (id) => document.getElementById(id);
const cloneTemplate = (id) => document.importNode(el(id).content, true);


function updatePrinter(printerParent, printer) {
    const qs = (query) => printerParent.querySelector(query);

    qs(".printer").id = printer.printer_id;
    qs(".printer-name").textContent = printer.name;
    qs(".status").textContent = printer.status;
    qs(".progress").textContent = printer.progress;
    qs(".remaining-time").textContent = printer.remaining_time;
}

UI.init = function () {

    const printerList = el("printer-list");
    const printList = el("print-list");

    // Create list of printers
    database.getPrinters().then(function (printers) {
        console.log(printers);
        printers.forEach(function (printer) {
            const newPrinter = cloneTemplate("printer");
            updatePrinter(newPrinter, printer);
            printerList.appendChild(newPrinter);
        });
    });

    // database.getLatestPrints().then(function (prints) {
    //     console.log(prints);
    //     prints.forEach(function (print) {
    //         console.log(print);
    //     });
    // });
};

export default Object.freeze(UI);