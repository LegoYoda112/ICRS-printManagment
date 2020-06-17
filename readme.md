## About
This webapp is a prototype for an app I am building for ICRS (Imperial College Robotics Society) that will allow users to view remote details about their prints. For the printers available in the database, it displays stats about the current print including progress, remaining time and status (if the printer is broken or offline for another reason). It also includes a database of previous prints, which, with the addition of user accounts, would allow for more intelligent filament billing for members. This print history also enables analysis of the usage patterns of the printers, with a 1 week history displayed on the website, helping users to determine the best time for them to come and start their prints. 


### Why do this/future evolution of the project
This idea formulated last year after getting annoyed at having to come back every now and again to check on the progress of the print. The motivation to pursue this further came with a combination of being elected lab manager and covid-19 forcing social distancing policies that will likely mean limited lab access next year. The final evolution of this project will probably be different depending on what lab opening policies look like next year (we may have no member access, requiring a print submission/management system to be implemented in some form, potently as part of this site)


## Layout
The project is split into several folders/modules
```
/ - Server, api authentication and request handler files
/db - database files
/fakePrinterUpdate - Browser based code that simulates the calls printerUpdate would be making
/printerUpdate - Prototype code that pulls information from an octoprint instance and sends to the server
/static - Static files for the main website
```


## How to run/test
```/.vscode``` includes a ```launch.json``` file that contains several launch options.
* "Node server" launches the main server (that serves the static site, API and database)
* "Main app" launches a firefox session that points to the root of the server
* "Fake printer" launches the fake printer update webpage that will simulate update calls to the server, input printer name and parameters that you wish to change
* "Run test" runs a set of unit(ish) tests that help test/debug the API calls. There are a couple minor corner cases that haven't been fixed yet, so expect a few errors.
* "Node printer update" runs the printer update code using node


## Project image credits
Prusa i3 MK3 image: https://www.prusa3d.com/wp-content/uploads/2019/09/MK-1-e1568036631208.png
