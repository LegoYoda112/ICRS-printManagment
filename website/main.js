// Imports
import printFarm from "./printFarm.js";

//For the sake of experiment
printFarm.loadPrinters();

setInterval(printFarm.updatePrinters, 5000);

window.addEventListener("DOMContentLoaded", function (){
    // Init UI things here
});