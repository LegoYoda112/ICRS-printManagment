const handlers = Object.create(null);

handlers.getPrinterList = function (obj, db) {
    // Returns a promise that is fufilled when the database
    // call has finished
    return new Promise(function(resolve, reject) {
        db.all(`SELECT * FROM printers`, function(err, rows) {
            if(err) {
                console.log(err.message);
            }
            resolve(rows);
        });
    });
};

handlers.updatePrinter = function(obj, db) {
    return new Promise(function(resolve, reject) {
        // Defines parameters that could be updated
        const parameters = ["type", "IP", "status",
                            "progress", "remaining_time"];
        let sql_query = "UPDATE printers SET ";

        // If a parameter is present in the update object,
        // add its update value to the sql call
        let firstRow = true;
        parameters.forEach( function (parameter, index) {
            if ( obj.hasOwnProperty(parameter) ){
                if(!firstRow){
                    sql_query += ", ";
                }
                firstRow = false;
                sql_query += `${parameter} = '${obj[parameter]}'`;
            }
        });

        sql_query += " ";

        // If printer_id is present: search by id
        if ( obj.hasOwnProperty("printer_id") ) {
            // If name is also present: update name
            if ( obj.hasOwnProperty("name") ) {
                sql_query += `name = '${obj.name}' `;
            }
            sql_query += `WHERE printer_id = ${obj.printer_id}`;
        } else if (obj.hasOwnProperty("name")){ 
            // If just name is present: search by name
            sql_query += `WHERE name = '${obj.name}' `;
        } else {
            throw new Error("Request must include a printer_id or name");
        }
        
        // Logs the sqlite query, runs it and then returns the new printer list
        console.log(sql_query);
        db.run(sql_query, function(err) {
            if(err) {
                console.error(err.message);
                throw new Error("Request must include a printer_id or name");
            }
            resolve(handlers.getPrinterList(obj, db));
        });
    });
};

handlers.getLatestPrints = function (obj, db) {
    return new Promise(function(resolve, reject) {
        resolve({"test": "test"});
    });
};

const handler = function (obj, db) {
    // Runs the corresponding handler function
    const type = obj.requestType;
    return handlers[type](obj, db);
};

export default Object.freeze(handler);