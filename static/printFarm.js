import printer from "./printer.js";

const printFarm = Object.create(null);

// List of all printers
printFarm.printerList = [];
// List of loaded print history,
// changes based on what type of history the user loads 
printFarm.loadedPrintHistory = [];

// Will end up being a async call to database
const getPrinters = function () {
    let printerList = [];

    // Test printers
    printerList.push(new printer.Printer("Prusa 1", "Prusa MK3"));
    printerList.push(new printer.Printer("Prusa 2", "Prusa MK3s"));

    return printerList;
};

// Gets printers from database and pushes them into the printer list
printFarm.loadPrinters = function () {
    let databasePrinterList = getPrinters();

    databasePrinterList.forEach(function (printer) {
        printFarm.printerList.push(printer);
    });
};

// Will be an async database call that updates the list of printers
printFarm.updatePrinters = function () {
    console.log("Updating printers");
    printFarm.printerList.forEach(function (printer) {
        printer.updateFromDB();
    });
    return;
};

// Print history options. Search by size, printer, user (admin)

printFarm.loadPrintHistory () {
    return
};

export default Object.freeze(printFarm);