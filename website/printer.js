const printer = Object.create(null);

printer.Printer = function (name, type, active=false, status = "Ok", printing = false, progress = 0, ip = "") {
    this.name = name;
    this.active = active;
    this.status = printing;
    this.progress = progress;
    this.ip = ip;
    this.type = type;
}

printer.Printer.prototype.toString = function printerToString(){
    return this.name;
}

export default Object.freeze(printer);