import printer from "./printer.js";

const printFarm = Object.create(null);


printFarm.list = [];

// Will end up being a async call to database
const getPrinters = function () {
    let printerList = [];

    // Test printers
    printerList.push(new printer.Printer("Prusa 1"));

    return printerList;
}

printFarm.loadPrinters = function () {
    let printerList = getPrinters();

    printerList.forEach(function (printer) {
        printFarm.list.push(printer);
    });
}

printFarm.updatePrinters = function () {
    return;
}

export default Object.freeze(printFarm);