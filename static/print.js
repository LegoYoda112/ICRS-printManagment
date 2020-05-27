const print = Object.create(null);

print.Print = function (name, datetime, user, length, printer, filamentUsed){
    this.datetime = datetime;
    this.user = user;
    this.length = length;
    this.filamentUsed = filamentUsed;
    this.printer = printer;
}

export default Object.freeze(print);