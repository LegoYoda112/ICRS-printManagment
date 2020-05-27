// Imports
import printFarm from "./printFarm.js";

//For the sake of experiment
printFarm.loadPrinters();

console.log(printFarm.list);

printFarm.updatePrinters();

console.log(printFarm.list);

window.addEventListener("DOMContentLoaded", function (){
    // Init UI things here
});