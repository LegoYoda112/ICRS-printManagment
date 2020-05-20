const printer = Object.create(null);

printer.Printer = function (name, type, active=false, status = "Ok", printing = false, progress = 0, ip = "") {
    this.name = name;
    this.active = active;
    this.status = printing; // Publicly displayed status if active is set to false
    this.progress = progress;
    this.ip = ip;
    this.type = type;

    // Reports a fault on the printer and updates the database
    this.reportFault = function (status, faultDescription){
        this.active = false;
        this.status = status;

        // update database accordingly
    };

    this.clearFault = function () {
        this.active = true;
        this.status = "ok";

        // update database accordingly
    }

    this.updateFromDB = function () {
        console.log("Updating printer: " + this.name);
        this.progress += 1;
        // update from database
        console.log("Progress: " + this.progress);
    }
}

export default Object.freeze(printer);