# Computing 2 Submission Proforma

**CID:** 01766999

## Brief
This is a web app I am designing for the robotics society, it's setup to show the live status of our 3D printers so people don't need to keep coming back into the lab to check if their print is finished/how much time is left. It also includes a chart to show the past week's history of prints to help show when printers are most/least used.

## Coding
This project was mostly driven by what data I could grab from the octoprint (https://octoprint.org/) server running on my local printer. Once I had that, I drafted a UI using Figma (www.figma.com) to display it and a database/server to store and serve the data. After that it was basically just writing the front end with html templates and plugging the back end in. 

## UX/UI
The two main elements of the UI design are the printer list and the printer chart. The printer list is made up of images, text and styled div elements. The chart is done using html canvas.

## Data
The server has a database of printers and prints which the client app requests upon load. Every 5 seconds, the client app also updates its list of printers so a "live" view can be achieved. An API like interface is used to add, update, list and search items in the sqlite database.

## Debugging
Being able to view objects in the console is incredibly helpful, I wouldn't have been able to do it without that. I also found a really useful tool (https://insomnia.rest/) to help debug the network requests. I worked on implementing tests for all the functionality in my API, while this helped me track down a couple bugs in my error handling but ended up being a lot more work then I expected. Because of how js and chai handle promises, the resulting test code was longer then the functionality I was testing.

## Best Practice
I attempted to keep consistent naming styles, a functional approach to problems and tried to avoid repeating code as much as possible. The database API is designed with the REST principles in mind, making it easy to take advantage of stored data to add other functionality.
