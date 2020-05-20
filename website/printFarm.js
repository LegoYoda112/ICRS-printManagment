import printer from "./printer.js";

const printFarm = Object.create(null);

// List of all printers
printFarm.list = [];

// Will end up being a async call to database
const getPrinters = function () {
    let printerList = [];

    // Test printers
    printerList.push(new printer.Printer("Prusa 1", "Prusa MK3"));
    printerList.push(new printer.Printer("Prusa 2", "Prusa MK3s"));

    //printerList[0].name = "Prusa 3";

    return printerList;
};

// Gets printers from database and pushes them into the printer list
printFarm.loadPrinters = function () {
    let printerList = getPrinters();

    printerList.forEach(function (printer) {
        printFarm.list.push(printer);
    });
};

// Will be an async database call that updates the list of printers
printFarm.updatePrinters = function () {
    printFarm.list.forEach(function (printer) {
        // Perform update on each printer
        printer.progress = 60;
        return;
    });
    return;
};

export default Object.freeze(printFarm);